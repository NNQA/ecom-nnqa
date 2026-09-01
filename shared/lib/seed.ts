import "dotenv/config"
import postgres from "postgres"
import { categorySeed } from "@/domains/category/data/categories.seed"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL is not set")
const sql = postgres(databaseUrl, { ssl: "require", max: 1, prepare: false })
async function seed() {
  await sql.begin(async (tx) => {
    const ids = new Map<string, number>()
    for (const root of categorySeed) {
      const [parent] = await tx<{ id: number }[]>`INSERT INTO categories (name, slug) VALUES (${root.name}, ${root.slug}) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`
      ids.set(root.slug, parent.id)
      for (const child of root.children) {
        const [row] = await tx<{ id: number }[]>`INSERT INTO categories (name, slug, parent_id) VALUES (${child.name}, ${child.slug}, ${parent.id}) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id RETURNING id`
        ids.set(child.slug, row.id)
      }
    }
    const categorySlugs = categorySeed.flatMap((root) =>
      root.children.map((child) => child.slug)
    )
    const products = categorySlugs.flatMap((categorySlug, categoryIndex) =>
      [0, 1].map((variantIndex) => {
        const categoryName = categorySlug
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ")
        const number = categoryIndex * 2 + variantIndex + 1
        return {
          name: `${categoryName} Essential ${variantIndex + 1}`,
          slug: `${categorySlug}-essential-${variantIndex + 1}`,
          sku: `SEED-${String(number).padStart(3, "0")}`,
          price: Number((15 + ((number * 17.37) % 485)).toFixed(2)),
          stock: 10 + ((number * 13) % 190),
          categorySlug,
        }
      })
    )
    for (const { name, slug, sku, price, stock, categorySlug } of products) {
      const categoryId = ids.get(categorySlug)
      if (!categoryId) continue
      await tx`INSERT INTO products (category_id, name, slug, sku, description, price, stock, images, status) VALUES (${categoryId}, ${name}, ${slug}, ${sku}, ${`Seed product: ${name}`}, ${price}, ${stock}, '[]'::jsonb, 'PUBLISHED') ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, stock = EXCLUDED.stock, category_id = EXCLUDED.category_id`
    }
  })
  console.log("Categories and products seeded")
}
try { await seed() } finally { await sql.end() }
