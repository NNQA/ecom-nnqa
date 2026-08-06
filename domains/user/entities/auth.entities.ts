export type PermissionCode = `${string}:${string}`

export interface Role {
  id: number
  code: string
  name: string
  description: string | null
  createdAt: Date
}

export interface Permission {
  id: number
  code: PermissionCode
  name: string
  description: string | null
  createdAt: Date
}

export interface UserWithRolesAndPermissions {
  id: string
  email: string | null
  name: string | null
  roles: string[]
  permissions: PermissionCode[]
}