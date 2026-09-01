import "server-only"
import {
  productIdSchema,
  productInputSchema,
  type ProductFilters,
} from "./dto/product.dto"
import * as repo from "./product.repository"
function slugify(v: string) {
  return (
    v
      .toLowerCase()
      .trim()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  )
}
async function uniqueSlug(name: string, id?: number) {
  const base = slugify(name)
  let slug = base,
    n = 2
  while (true) {
    const found = await repo.findBySlug(slug)
    if (!found || found.id === id) return slug
    slug = `${base}-${n++}`
  }
}
function parse(input: unknown) {
  return productInputSchema.parse(input)
}
export const getProducts = (filters: ProductFilters = {}) =>
  repo.findMany(filters)
export const getProductById = (id: unknown) =>
  repo.findById(productIdSchema.parse(id))
export const getProductBySlug = (slug: string) => repo.findBySlug(slug)
export const getProductBySku = (sku: string) => repo.findBySku(sku)
export async function createProduct(input: unknown) {
  const data = parse(input)
  if (await repo.findBySku(data.sku)) throw new Error("SKU already exists")
  return repo.create({ ...data, slug: await uniqueSlug(data.name) })
}
export async function updateProduct(id: unknown, input: unknown) {
  const productId = productIdSchema.parse(id)
  if (!(await repo.findById(productId))) throw new Error("Product not found")
  const data = parse(input)
  const existing = await repo.findBySku(data.sku)
  if (existing && existing.id !== productId)
    throw new Error("SKU already exists")
  return repo.update(productId, {
    ...data,
    slug: await uniqueSlug(data.name, productId),
  })
}
export async function deleteProduct(id: unknown) {
  const productId = productIdSchema.parse(id)
  if (!(await repo.findById(productId))) throw new Error("Product not found")
  return repo.deleteProduct(productId)
}
