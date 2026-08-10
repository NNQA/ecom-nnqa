import { z } from "zod"

import type { UserStatus } from "../entities/auth.entities"

export type UserManagementRoleDto = {
  id: string
  code: string
  name: string
}

export type UserListItemDto = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  status: UserStatus
  roles: UserManagementRoleDto[]
  createdAt: Date
}

export type UserProfileDto = UserListItemDto & {
  firstName: string | null
  lastName: string | null
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

export type UserListResultDto = {
  users: UserListItemDto[]
  total: number
  page: number
  pageSize: number
}

export type UserListFilters = {
  query?: string
  status?: UserStatus
  roleId?: string
  page?: number
  pageSize?: number
}

export const updateUserProfileSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().trim().max(100).nullable(),
  lastName: z.string().trim().max(100).nullable(),
  phone: z.string().trim().max(30).nullable(),
  avatarUrl: z.string().url().max(2048).nullable(),
})

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
