import type { Sql } from "postgres"

const permissions = [
  ["category:read", "Read categories", "View category data"],
  ["category:create", "Create categories", "Create categories"],
  ["category:update", "Update categories", "Update categories"],
  ["category:delete", "Delete categories", "Delete categories"],
  ["order:read", "Read orders", "View orders"],
  ["order:manage", "Manage orders", "Create and update orders"],
  ["user:manage", "Manage users", "Manage users and their roles"],
] as const

const rolePermissions: Record<"ADMIN" | "STAFF" | "CUSTOMER", readonly string[]> = {
  ADMIN: permissions.map(([code]) => code),
  STAFF: ["category:read", "category:create", "category:update", "order:read", "order:manage"],
  CUSTOMER: ["category:read", "order:read"],
}

export async function seedRbac(sql: Sql): Promise<void> {
  for (const [code, name, description] of permissions) {
    await sql`
      INSERT INTO permissions (code, name, description)
      VALUES (${code}, ${name}, ${description})
      ON CONFLICT (code) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description
    `
  }

  for (const [code, name] of [["ADMIN", "Administrator"], ["STAFF", "Staff"], ["CUSTOMER", "Customer"]] as const) {
    await sql`
      INSERT INTO roles (code, name)
      VALUES (${code}, ${name})
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
    `
  }

  for (const [roleCode, codes] of Object.entries(rolePermissions)) {
    for (const permissionCode of codes) {
      await sql`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        INNER JOIN permissions p ON p.code = ${permissionCode}
        WHERE r.code = ${roleCode}
        ON CONFLICT (role_id, permission_id) DO NOTHING
      `
    }
  }
}