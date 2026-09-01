import "dotenv/config"
import postgres, { type TransactionSql } from "postgres"
import { migrateCategories } from "@/domains/category/migrations/001_categories"
import { migrateUserManagement } from "@/domains/user/migrations/rbac.migration"
import { migrateProducts } from "@/domains/product/migrations/002_products"

type Migration = { id: string; up: (sql: TransactionSql) => Promise<void> }
const migrations: Migration[] = [
  { id: "001_user_rbac", up: migrateUserManagement },
  { id: "002_category", up: migrateCategories },
  { id: "003_product", up: migrateProducts },
]
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL is not set")
const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
})
async function runMigrations() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  const appliedRows = await sql<
    { id: string }[]
  >`SELECT id FROM schema_migrations ORDER BY id`
  const applied = new Set(appliedRows.map((row) => row.id))
  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      console.log(`Skipping ${migration.id}`)
      continue
    }
    console.log(`Applying ${migration.id}`)
    await sql.begin(async (transaction) => {
      await migration.up(transaction)
      await transaction`INSERT INTO schema_migrations (id) VALUES (${migration.id})`
    })
    console.log(`Applied ${migration.id}`)
  }
}
try {
  await runMigrations()
  console.log("Migrations complete")
} finally {
  await sql.end()
}
