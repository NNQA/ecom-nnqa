"use server"

import { revalidatePath } from "next/cache"

import { updateUserProfileSchema } from "../dto/user-management.dto"
import {
  assignUserRoleToUser,
  banUser,
  removeRoleFromUser,
  unbanUser,
  updateUserProfile,
} from "../services/user-management.service"
import { AuthorizationError, requirePermission } from "../utils/authorization"

type ActionResult = { error?: string; message?: string }

function actionError(error: unknown): ActionResult {
  if (error instanceof AuthorizationError) return { error: error.message }
  if (error instanceof Error) return { error: error.message }
  return {
    error: "The requested user-management operation could not be completed.",
  }
}

function revalidateUsers(userId: string) {
  revalidatePath("/dashboard/users")
  revalidatePath(`/dashboard/users/${userId}`)
}

export async function updateUserProfileAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission("user:update")
    const input = updateUserProfileSchema.parse({
      userId: formData.get("userId"),
      firstName: blankToNull(formData.get("firstName")),
      lastName: blankToNull(formData.get("lastName")),
      phone: blankToNull(formData.get("phone")),
      avatarUrl: blankToNull(formData.get("avatarUrl")),
    })
    await updateUserProfile(input)
    revalidateUsers(input.userId)
    return { message: "Profile updated" }
  } catch (error) {
    return actionError(error)
  }
}

export async function setUserStatusAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission("user:ban")
    const userId = String(formData.get("userId") ?? "")
    const status = String(formData.get("status") ?? "")
    if (
      !/^[0-9a-f-]{36}$/i.test(userId) ||
      (status !== "ACTIVE" && status !== "BANNED")
    ) {
      return { error: "Invalid user status request." }
    }
    if (status === "BANNED") await banUser(userId)
    else await unbanUser(userId)
    revalidateUsers(userId)
    return { message: status === "BANNED" ? "User banned" : "User unbanned" }
  } catch (error) {
    return actionError(error)
  }
}

export async function assignUserRoleAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission("user:role:assign")
    const userId = String(formData.get("userId") ?? "")
    const roleId = String(formData.get("roleId") ?? "")
    if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^[0-9a-f-]{36}$/i.test(roleId))
      return { error: "Invalid role assignment request." }
    const assigned = await assignUserRoleToUser(userId, roleId)
    revalidateUsers(userId)
    return {
      message: assigned ? "Role assigned" : "User already has this role",
    }
  } catch (error) {
    return actionError(error)
  }
}

export async function removeUserRoleAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission("user:role:remove")
    const userId = String(formData.get("userId") ?? "")
    const roleId = String(formData.get("roleId") ?? "")
    const roleCode = String(formData.get("roleCode") ?? "")
    if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^[0-9a-f-]{36}$/i.test(roleId))
      return { error: "Invalid role removal request." }
    const removed = await removeRoleFromUser(userId, roleId, roleCode)
    revalidateUsers(userId)
    return {
      message: removed ? "Role removed" : "User no longer has this role",
    }
  } catch (error) {
    return actionError(error)
  }
}

function blankToNull(value: FormDataEntryValue | null): string | null {
  const stringValue = typeof value === "string" ? value.trim() : ""
  return stringValue || null
}
