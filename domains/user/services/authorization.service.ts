import "server-only"

import {
  getPermissionsByUserId,
  getRolesByUserId,
} from "../repositories/authorization.repository"

export async function hasPermission(
  userId: string,
  requiredPermission: string
): Promise<boolean> {
  const permissions = await getPermissionsByUserId(userId)
  return permissions.includes(
    requiredPermission as (typeof permissions)[number]
  )
}

export async function hasRole(
  userId: string,
  requiredRole: string
): Promise<boolean> {
  const roles = await getRolesByUserId(userId)
  return roles.includes(requiredRole)
}
