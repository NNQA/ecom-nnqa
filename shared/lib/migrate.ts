/**
 * Schema migration — drops and recreates all tables per update.md Task 1.
 * Run with: bun run lib/migrate.ts
 */
import postgres from "postgres";
import * as dotenv from "fs";

// Manually load .env since we're outside Next.js
const envPath = new URL("../../.env", import.meta.url).pathname;
try {
  const raw = dotenv.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env may not exist in production — rely on real env vars
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

async function migrate() {
  console.log("🔄  Connecting to Neon DB…");

  // ── Drop existing tables ───────────────────────────────────────────────────
  await sql`DROP TABLE IF EXISTS products, brands, categories, shops CASCADE`;
  console.log("🗑   Dropped existing tables.");

  // ── brands ─────────────────────────────────────────────────────────────────
  await sql`
    CREATE TABLE brands (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `;
  console.log("✅  Created table: brands");

  // ── categories ─────────────────────────────────────────────────────────────
  await sql`
    CREATE TABLE categories (
      id        SERIAL PRIMARY KEY,
      parent_id INT REFERENCES categories(id),
      name      TEXT NOT NULL,
      slug      TEXT UNIQUE NOT NULL
    )
  `;
  console.log("✅  Created table: categories");

  // ── shops ──────────────────────────────────────────────────────────────────
  await sql`
    CREATE TABLE shops (
      id        SERIAL PRIMARY KEY,
      owner_id  TEXT NOT NULL,
      name      TEXT NOT NULL,
      slug      TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE
    )
  `;
  console.log("✅  Created table: shops");

  // ── products ───────────────────────────────────────────────────────────────
  await sql`
    CREATE TABLE products (
      id          SERIAL PRIMARY KEY,
      shop_id     INT REFERENCES shops(id),
      category_id INT REFERENCES categories(id),
      brand_id    INT REFERENCES brands(id),
      sku         TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      slug        TEXT UNIQUE NOT NULL,
      description TEXT,
      price       NUMERIC(12, 2) NOT NULL,
      image_urls  TEXT[]  DEFAULT '{}',
      stock       INT     DEFAULT 0,
      sales_count INT     DEFAULT 0,
      rating_avg  NUMERIC(3, 2) DEFAULT 0,
      rating_count INT    DEFAULT 0,
      attributes  JSONB   DEFAULT '{}',
      is_active   BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✅  Created table: products");

  await sql.end();
  console.log("🎉  Migration complete — all tables created successfully.");
}

migrate().catch((err) => {
  console.error("❌  Migration failed:", err);
  process.exit(1);
});
