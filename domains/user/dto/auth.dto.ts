import { z } from "zod"

export const permissionCodeSchema = z
  .string()
  .regex(
    /^[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)+$/,
    "Permission must use colon-separated lowercase segments"
  )

export const roleCodeSchema = z
  .string()
  .regex(/^[A-Z][A-Z0-9_]*$/, "Role code must be uppercase snake case")

export const assignRoleSchema = z.object({
  userId: z.string().min(1),
  roleCode: roleCodeSchema,
})

export type AssignRoleInput = z.infer<typeof assignRoleSchema>

export interface ProfileDto {
  userId: string

  firstName: string | null

  lastName: string | null

  phone: string | null

  avatarUrl: string | null

  gender: "male" | "female" | "other" | null

  birthday: Date | null

  createdAt: Date

  updatedAt: Date
}
export interface RoleDto {
  id: string

  code: string

  name: string

  description: string | null

  isSystem: boolean

  createdAt: Date
}

export interface PermissionDto {
  id: string

  code: string

  name: string

  description: string | null

  createdAt: Date
}
export interface UserRoleDto {
  userId: string

  roleId: string
}

export interface RolePermissionDto {
  roleId: string

  permissionId: string
}
