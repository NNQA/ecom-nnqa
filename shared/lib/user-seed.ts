import "dotenv/config"
import postgres from "postgres"
import { seedRbac } from "@/domains/user/data/rbac.seed"
const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set")
const sql = postgres(url, { ssl: "require", max: 1, prepare: false })
const accounts = [
  ["admin@example.com", "Admin@123456", "Platform", "Admin", "SUPER_ADMIN"],
  ["owner@example.com", "Owner@123456", "Store", "Owner", "STORE_OWNER"],
  ["staff@example.com", "Staff@123456", "Store", "Staff", "STORE_STAFF"],
  ["support@example.com", "Support@123456", "Customer", "Support", "SUPPORT"],
  ...Array.from({ length: 20 }, (_, i) => [`customer${i + 1}@example.com`, "Customer@123456", "Demo", `Customer ${i + 1}`, "CUSTOMER"] as const),
] as const
async function createAuthUser(email: string, password: string, name: string) {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is not set")
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/sign-up/email`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ email, password, name, callbackURL: `${origin}/` }) })
    const data = await response.json().catch(() => ({}))
    if (response.ok) return data.user as { id: string }
    if (response.status === 429 && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt))
      continue
    }
    throw new Error(`Failed to create ${email}: ${data?.message ?? data?.error ?? JSON.stringify(data)}`)
  }
  throw new Error(`Failed to create ${email}`)
}
try {
  await sql.begin(async (tx) => {
    await tx`DELETE FROM user_roles`; await tx`DELETE FROM profiles`; await tx`DELETE FROM role_permissions`; await tx`DELETE FROM roles WHERE is_system = TRUE`; await tx`DELETE FROM permissions`; await seedRbac(tx)
  })
  for (const [email, password, firstName, lastName, role] of accounts) {
    const [existing] = await sql<{ id: string }[]>`SELECT id FROM neon_auth."user" WHERE email = ${email}`
    let user = existing
    if (!user) {
      try { user = await createAuthUser(email, password, `${firstName} ${lastName}`) }
      catch (error) { console.warn(`Skipping ${email}: ${(error as Error).message}`); continue }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    await sql`INSERT INTO profiles (user_id, first_name, last_name, status) VALUES (${user.id}, ${firstName}, ${lastName}, 'ACTIVE') ON CONFLICT (user_id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, status = 'ACTIVE'`
    await sql`INSERT INTO user_roles (user_id, role_id) SELECT ${user.id}, id FROM roles WHERE code = ${role} ON CONFLICT DO NOTHING`
  }
  console.log("Users and roles seeded")
} finally { await sql.end() }
