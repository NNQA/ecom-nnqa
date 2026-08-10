import "server-only"

import type { UpdateUserProfileInput } from "../dto/user-management.dto"
import {
  assignUserRole,
  findRoles,
  findUserProfile,
  findUsers,
  isLastActiveAdmin,
  removeUserRole,
  updateProfile,
  updateUserStatus,
} from "../repositories/user-management.repository"

export {
  findRoles as getAvailableRoles,
  findUserProfile as getUserProfile,
  findUsers as getUsers,
}

export async function updateUserProfile(input: UpdateUserProfileInput) {
  return updateProfile(input)
}

export async function banUser(userId: string) {
  if (await isLastActiveAdmin(userId))
    throw new Error("The last active administrator cannot be banned")
  await updateUserStatus(userId, "BANNED")
}

export async function unbanUser(userId: string) {
  await updateUserStatus(userId, "ACTIVE")
}

export async function assignUserRoleToUser(userId: string, roleId: string) {
  return assignUserRole(userId, roleId)
}

export async function removeRoleFromUser(
  userId: string,
  roleId: string,
  roleCode: string
) {
  if (roleCode === "ADMIN" && (await isLastActiveAdmin(userId))) {
    throw new Error("The last active administrator role cannot be removed")
  }
  return removeUserRole(userId, roleId)
}
