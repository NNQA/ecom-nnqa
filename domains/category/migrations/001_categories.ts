import type { TransactionSql } from "postgres"
export async function migrateCategories(sql: TransactionSql): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, parent_id INT REFERENCES categories(id) ON DELETE RESTRICT, is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT`
  await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE`
  await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique_idx ON categories(slug)`
  await sql`CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id)`
}

