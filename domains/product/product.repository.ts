import "server-only"
import { getDb } from "@/shared/lib/db/db.server"
import type { TransactionSql } from "postgres"
import type { ProductInput, ProductFilters } from "./dto/product.dto"
import type { Product, ProductVariant } from "./entities/product.entities"
type Row = Omit<Product, "variants" | "images" | "price"> & {
  images: string[]
  price: number
}
const map = (r: Row, variants: ProductVariant[] = []): Product => ({
  ...r,
  variants,
})
async function variants(productId: number) {
  const sql = getDb()
  return sql<
    ProductVariant[]
  >`SELECT id,product_id AS "productId",sku,name,price::float,stock,image_url AS "imageUrl" FROM product_variants WHERE product_id=${productId} ORDER BY id`
}
export async function findMany(
  filters: ProductFilters = {}
): Promise<{
  products: Product[]
  total: number
  page: number
  pageSize: number
}> {
  const sql = getDb()
  const page = Math.max(filters.page ?? 1, 1),
    pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100),
    offset = (page - 1) * pageSize
  const q = filters.query ? `%${filters.query}%` : `%`
  const category = filters.categoryId ?? null,
    status = filters.status ?? null,
    min = filters.minPrice ?? null,
    max = filters.maxPrice ?? null
  const order =
    filters.sort === "price_asc"
      ? sql`price ASC`
      : filters.sort === "price_desc"
        ? sql`price DESC`
        : sql`created_at DESC`
  const rows = await sql<
    Row[]
  >`SELECT id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE (name ILIKE ${q} OR sku ILIKE ${q}) AND (${category}::int IS NULL OR category_id=${category}) AND (${status}::text IS NULL OR status=${status}) AND (${min}::numeric IS NULL OR price>=${min}) AND (${max}::numeric IS NULL OR price<=${max}) ORDER BY ${order} LIMIT ${pageSize} OFFSET ${offset}`
  const [{ count }] = await sql<
    { count: string }[]
  >`SELECT COUNT(*)::text AS count FROM products WHERE (name ILIKE ${q} OR sku ILIKE ${q}) AND (${category}::int IS NULL OR category_id=${category}) AND (${status}::text IS NULL OR status=${status})`
  return {
    products: await Promise.all(
      rows.map(async (r) => map(r, await variants(r.id)))
    ),
    total: Number(count ?? 0),
    page,
    pageSize,
  }
}
export async function findById(id: number) {
  const sql = getDb()
  const [r] = await sql<
    Row[]
  >`SELECT id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE id=${id}`
  return r ? map(r, await variants(id)) : null
}
export async function findBySlug(slug: string) {
  const sql = getDb()
  const [r] = await sql<
    Row[]
  >`SELECT id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE slug=${slug}`
  return r ? map(r, await variants(r.id)) : null
}
export async function findBySku(sku: string) {
  const sql = getDb()
  const [r] = await sql<
    Row[]
  >`SELECT id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt" FROM products WHERE sku=${sku}`
  return r ? map(r, await variants(r.id)) : null
}
async function writeVariants(
  sql: TransactionSql,
  productId: number,
  items: ProductInput["variants"]
) {
  await sql`DELETE FROM product_variants WHERE product_id=${productId}`
  for (const v of items)
    await sql`INSERT INTO product_variants(product_id,sku,name,price,stock,image_url) VALUES(${productId},${v.sku},${v.name},${v.price},${v.stock},${v.imageUrl})`
}
export async function create(input: ProductInput & { slug: string }) {
  const sql = getDb()
  return sql.begin(async (tx) => {
    const [r] = await tx<
      Row[]
    >`INSERT INTO products(shop_id,category_id,name,slug,sku,description,price,stock,images,status) VALUES(${input.shopId},${input.categoryId},${input.name},${input.slug},${input.sku},${input.description},${input.price},${input.stock},${JSON.stringify(input.images)},${input.status}) RETURNING id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt"`
    await writeVariants(tx, r.id, input.variants)
    return map(
      r,
      input.variants.map((v, i) => ({
        ...v,
        id: i + 1,
        productId: r.id,
        imageUrl: v.imageUrl,
      }))
    )
  })
}
export async function update(
  id: number,
  input: ProductInput & { slug: string }
) {
  const sql = getDb()
  return sql.begin(async (tx) => {
    const [r] = await tx<
      Row[]
    >`UPDATE products SET shop_id=${input.shopId},category_id=${input.categoryId},name=${input.name},slug=${input.slug},sku=${input.sku},description=${input.description},price=${input.price},stock=${input.stock},images=${JSON.stringify(input.images)},status=${input.status},updated_at=NOW() WHERE id=${id} RETURNING id,shop_id AS "shopId",category_id AS "categoryId",name,slug,sku,description,price::float,stock,images,status,created_at AS "createdAt",updated_at AS "updatedAt"`
    if (!r) throw new Error("Product not found")
    await writeVariants(tx, id, input.variants)
    return map(
      r,
      input.variants.map((v, i) => ({
        ...v,
        id: i + 1,
        productId: id,
        imageUrl: v.imageUrl,
      }))
    )
  })
}
export async function deleteProduct(id: number) {
  await getDb()`DELETE FROM products WHERE id=${id}`
}
