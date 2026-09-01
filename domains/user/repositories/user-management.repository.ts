import "server-only"

import { getDb as getDb } from "@/shared/lib/db/db.server"

import type {
  UpdateUserProfileInput,
  UserListFilters,
  UserListItemDto,
  UserListResultDto,
  UserManagementRoleDto,
  UserProfileDto,
} from "../dto/user-management.dto"
import type { UserStatus } from "../entities/auth.entities"
import { findAuthUserById } from "./user.repository"

type UserRow = Omit<UserListItemDto, "roles"> & {
  roleIds: string[]
  roleCodes: string[]
  roleNames: string[]
}

type ProfileRow = UserRow & {
  firstName: string | null
  lastName: string | null
  phone: string | null
  updatedAt: Date
}

type RoleRow = UserManagementRoleDto

function mapRoles(row: UserRow): UserManagementRoleDto[] {
  return row.roleIds.map((id, index) => ({
    id,
    code: row.roleCodes[index],
    name: row.roleNames[index],
  }))
}

function listUserQuery(filters: UserListFilters) {
  const query = filters.query?.trim() ?? ""
  return `%${query}%`
}

export async function findUsers(
  filters: UserListFilters = {}
): Promise<UserListResultDto> {
  const sql = getDb()
  const pageSize = Math.min(Math.max(filters.pageSize ?? 10, 1), 100)
  const page = Math.max(filters.page ?? 1, 1)
  const offset = (page - 1) * pageSize
  const pattern = listUserQuery(filters)
  const status = filters.status ?? null
  const roleId = filters.roleId ?? null

  const [rows, countRows] = await Promise.all([
    sql<UserRow[]>`
      SELECT
        u.id,
        u.email,
        COALESCE(NULLIF(CONCAT_WS(' ', p.first_name, p.last_name), ''), u.name) AS name,
        COALESCE(p.avatar_url, u.image) AS "avatarUrl",
        COALESCE(p.status, 'ACTIVE') AS status,
        u."createdAt" AS "createdAt",
        COALESCE(ARRAY_AGG(r.id ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleIds",
        COALESCE(ARRAY_AGG(r.code ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleCodes",
        COALESCE(ARRAY_AGG(r.name ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleNames"
      FROM neon_auth."user" u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE (u.email ILIKE ${pattern} OR u.name ILIKE ${pattern} OR CONCAT_WS(' ', p.first_name, p.last_name) ILIKE ${pattern})
        AND (${status}::text IS NULL OR COALESCE(p.status, 'ACTIVE') = ${status})
        AND (${roleId}::uuid IS NULL OR EXISTS (
          SELECT 1 FROM user_roles filtered_roles
          WHERE filtered_roles.user_id = u.id AND filtered_roles.role_id = ${roleId}::uuid
        ))
      GROUP BY u.id, p.first_name, p.last_name, p.avatar_url, p.status
      ORDER BY u."createdAt" DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count
      FROM neon_auth."user" u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE (u.email ILIKE ${pattern} OR u.name ILIKE ${pattern} OR CONCAT_WS(' ', p.first_name, p.last_name) ILIKE ${pattern})
        AND (${status}::text IS NULL OR COALESCE(p.status, 'ACTIVE') = ${status})
        AND (${roleId}::uuid IS NULL OR EXISTS (
          SELECT 1 FROM user_roles filtered_roles
          WHERE filtered_roles.user_id = u.id AND filtered_roles.role_id = ${roleId}::uuid
        ))
    `,
  ])

  return {
    users: rows.map((row) => ({ ...row, roles: mapRoles(row) })),
    total: Number(countRows[0]?.count ?? 0),
    page,
    pageSize,
  }
}

export async function findUserProfile(
  userId: string
): Promise<UserProfileDto | null> {
  const sql = getDb()
  const [row] = await sql<ProfileRow[]>`
    SELECT
      u.id,
      u.email,
      COALESCE(NULLIF(CONCAT_WS(' ', p.first_name, p.last_name), ''), u.name) AS name,
      COALESCE(p.avatar_url, u.image) AS "avatarUrl",
      COALESCE(p.status, 'ACTIVE') AS status,
      p.first_name AS "firstName",
      p.last_name AS "lastName",
      p.phone,
      u."createdAt" AS "createdAt",
      COALESCE(p.updated_at, u."updatedAt") AS "updatedAt",
      COALESCE(ARRAY_AGG(r.id ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleIds",
      COALESCE(ARRAY_AGG(r.code ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleCodes",
      COALESCE(ARRAY_AGG(r.name ORDER BY r.code) FILTER (WHERE r.id IS NOT NULL), '{}') AS "roleNames"
    FROM neon_auth."user" u
    LEFT JOIN profiles p ON p.user_id = u.id
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.id = ${userId}
    GROUP BY u.id, p.first_name, p.last_name, p.phone, p.avatar_url, p.status, p.updated_at
  `

  return row ? { ...row, roles: mapRoles(row) } : null
}

export async function findRoles(): Promise<UserManagementRoleDto[]> {
  const sql = getDb()
  return sql<RoleRow[]>`SELECT id, code, name FROM roles ORDER BY name`
}

export async function updateProfile(
  input: UpdateUserProfileInput
): Promise<void> {
  const user = await findAuthUserById(input.userId)
  if (!user) throw new Error("User not found")

  const sql = getDb()
  await sql`
    INSERT INTO profiles (user_id, first_name, last_name, phone, avatar_url)
    VALUES (${input.userId}, ${input.firstName}, ${input.lastName}, ${input.phone}, ${input.avatarUrl})
    ON CONFLICT (user_id) DO UPDATE
    SET first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
  `
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<void> {
  const user = await findAuthUserById(userId)
  if (!user) throw new Error("User not found")

  const sql = getDb()
  await sql`
    INSERT INTO profiles (user_id, status)
    VALUES (${userId}, ${status})
    ON CONFLICT (user_id) DO UPDATE
    SET status = EXCLUDED.status,
        updated_at = NOW()
  `
}

export async function assignUserRole(
  userId: string,
  roleId: string
): Promise<boolean> {
  const user = await findAuthUserById(userId)
  if (!user) throw new Error("User not found")

  const sql = getDb()
  const [role] = await sql<
    { id: string }[]
  >`SELECT id FROM roles WHERE id = ${roleId}::uuid`
  if (!role) throw new Error("Role not found")

  const rows = await sql`
    INSERT INTO user_roles (user_id, role_id)
    VALUES (${userId}, ${roleId}::uuid)
    ON CONFLICT (user_id, role_id) DO NOTHING
    RETURNING role_id
  `
  return rows.length > 0
}

export async function removeUserRole(
  userId: string,
  roleId: string
): Promise<boolean> {
  const user = await findAuthUserById(userId)
  if (!user) throw new Error("User not found")

  const sql = getDb()
  const rows = await sql`
    DELETE FROM user_roles
    WHERE user_id = ${userId} AND role_id = ${roleId}::uuid
    RETURNING role_id
  `
  return rows.length > 0
}

export async function isLastActiveAdmin(userId: string): Promise<boolean> {
  const sql = getDb()
  const [target] = await sql<{ is_admin: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = ${userId} AND r.code = 'ADMIN'
    ) AS is_admin
  `
  if (!target?.is_admin) return false

  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM user_roles ur
    INNER JOIN roles r ON r.id = ur.role_id
    LEFT JOIN profiles p ON p.user_id = ur.user_id
    WHERE r.code = 'ADMIN'
      AND ur.user_id <> ${userId}
      AND COALESCE(p.status, 'ACTIVE') = 'ACTIVE'
  `
  return Number(row?.count ?? 0) === 0
}
