import "server-only"

import { useDb as getDb } from "@/shared/lib/db/db.server"

import type {
  PermissionCode,
  UserWithRolesAndPermissions,
} from "../entities/auth.entities"
import { findAuthUserById } from "./user.repository"

type CodeRow = { code: string }
type RoleIdRow = { id: string }

export async function getPermissionsByUserId(
  userId: string
): Promise<PermissionCode[]> {
  const sql = getDb()
  const rows = await sql<CodeRow[]>`
    SELECT DISTINCT p.code
    FROM permissions p
    INNER JOIN role_permissions rp ON rp.permission_id = p.id
    INNER JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = ${userId}
    ORDER BY p.code
  `

  return rows.map((row) => row.code as PermissionCode)
}

export async function getRolesByUserId(userId: string): Promise<string[]> {
  const sql = getDb()
  const rows = await sql<CodeRow[]>`
    SELECT r.code
    FROM roles r
    INNER JOIN user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = ${userId}
    ORDER BY r.code
  `

  return rows.map((row) => row.code)
}

export async function assignRoleToUser(
  userId: string,
  roleCode: string
): Promise<void> {
  const sql = getDb()
  const [user, role] = await Promise.all([
    findAuthUserById(userId),
    sql<RoleIdRow[]>`SELECT id FROM roles WHERE code = ${roleCode}`.then(
      ([row]) => row
    ),
  ])

  if (!user) throw new Error("User not found")
  if (!role) throw new Error(`RBAC role not found: ${roleCode}`)

  await sql`
    INSERT INTO user_roles (user_id, role_id)
    VALUES (${userId}, ${role.id})
    ON CONFLICT (user_id, role_id) DO NOTHING
  `
}

export async function revokeRoleFromUser(
  userId: string,
  roleCode: string
): Promise<void> {
  const sql = getDb()
  await sql`
    DELETE FROM user_roles ur
    USING roles r
    WHERE ur.role_id = r.id
      AND ur.user_id = ${userId}
      AND r.code = ${roleCode}
  `
}

export async function getUserWithRolesAndPermissions(
  userId: string
): Promise<UserWithRolesAndPermissions | null> {
  const user = await findAuthUserById(userId)
  if (!user) return null

  const [roles, permissions] = await Promise.all([
    getRolesByUserId(userId),
    getPermissionsByUserId(userId),
  ])

  return { ...user, roles, permissions }
}
