import type { Sql } from "postgres"

const permissions = [
  ["category:read", "Read categories", "View category data"],
  ["category:create", "Create categories", "Create categories"],
  ["category:update", "Update categories", "Update categories"],
  ["category:delete", "Delete categories", "Delete categories"],
  ["order:read", "Read orders", "View orders"],
  ["order:manage", "Manage orders", "Create and update orders"],
  ["user:manage", "Manage users", "Manage users and their roles"],
  ["user:read", "Read users", "View user administration data"],
  ["user:update", "Update users", "Update application user profiles"],
  ["user:ban", "Ban users", "Change application account status"],
  ["user:role:assign", "Assign user roles", "Assign roles to users"],
  ["user:role:remove", "Remove user roles", "Remove roles from users"],
] as const

const rolePermissions: Record<
  "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER",
  readonly string[]
> = {
  SUPER_ADMIN: permissions.map(([code]) => code),
  ADMIN: permissions.map(([code]) => code),
  STAFF: [
    "category:read",
    "category:create",
    "category:update",
    "order:read",
    "order:manage",
  ],
  CUSTOMER: ["category:read", "order:read"],
}

export async function seedRbac(sql: Sql): Promise<void> {
  for (const [code, name, description] of permissions) {
    await sql`
      INSERT INTO permissions (code, name, description)
      VALUES (${code}, ${name}, ${description})
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    `
  }

  for (const [code, name] of [
    ["SUPER_ADMIN", "Super administrator"],
    ["ADMIN", "Administrator"],
    ["STAFF", "Staff"],
    ["CUSTOMER", "Customer"],
  ] as const) {
    await sql`
      INSERT INTO roles (code, name, is_system)
      VALUES (${code}, ${name}, TRUE)
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, is_system = TRUE
    `
  }

  for (const [roleCode, codes] of Object.entries(rolePermissions)) {
    for (const permissionCode of codes) {
      await sql`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id FROM roles r INNER JOIN permissions p ON p.code = ${permissionCode}
        WHERE r.code = ${roleCode}
        ON CONFLICT (role_id, permission_id) DO NOTHING
      `
    }
  }

  // Development identities must first be created by Neon Auth. This seed enriches
  // only those existing identities and never inserts credentials or auth rows.
  for (const [email, firstName, lastName, status] of [
    ["admin@example.com", "Admin", "User", "ACTIVE"],
    ["staff@example.com", "Staff", "User", "ACTIVE"],
    ["customer@example.com", "Customer", "User", "ACTIVE"],
    ["banned@example.com", "Banned", "User", "BANNED"],
    ["multi-role@example.com", "Multi", "Role User", "ACTIVE"],
  ] as const) {
    await sql`
      INSERT INTO profiles (user_id, first_name, last_name, status)
      SELECT id, ${firstName}, ${lastName}, ${status}
      FROM neon_auth."user" WHERE email = ${email}
      ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
        status = EXCLUDED.status, updated_at = NOW()
    `
  }

  for (const [email, roleCode] of [
    ["admin@example.com", "ADMIN"],
    ["staff@example.com", "STAFF"],
    ["customer@example.com", "CUSTOMER"],
    ["banned@example.com", "CUSTOMER"],
    ["multi-role@example.com", "STAFF"],
    ["multi-role@example.com", "CUSTOMER"],
  ] as const) {
    await sql`
      INSERT INTO user_roles (user_id, role_id)
      SELECT u.id, r.id FROM neon_auth."user" u INNER JOIN roles r ON r.code = ${roleCode}
      WHERE u.email = ${email}
      ON CONFLICT (user_id, role_id) DO NOTHING
    `
  }
}
