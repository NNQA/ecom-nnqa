export type PermissionCode = `${string}:${string}`

export interface Role {
  id: string
  code: string
  name: string
  description: string | null
  createdAt: Date
}

export interface Permission {
  id: string
  code: PermissionCode
  name: string
  description: string | null
  createdAt: Date
}

export type UserStatus = "ACTIVE" | "BANNED"

export interface UserWithRolesAndPermissions {
  id: string
  email: string | null
  name: string | null
  roles: string[]
  permissions: PermissionCode[]
}
