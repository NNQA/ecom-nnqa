import type { TransactionSql } from "postgres"
export async function migrateProducts(sql: TransactionSql): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, shop_id INT NULL, category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, sku TEXT UNIQUE NOT NULL, description TEXT, price NUMERIC(12,2) NOT NULL CHECK (price >= 0), stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0), images JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(images) = 'array'), status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  await sql`CREATE TABLE IF NOT EXISTS product_variants (id SERIAL PRIMARY KEY, product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE, sku TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price NUMERIC(12,2) NOT NULL CHECK (price >= 0), stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0), image_url TEXT)`
  await sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id)`
  await sql`CREATE INDEX IF NOT EXISTS products_status_idx ON products(status)`
  await sql`CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants(product_id)`
}
