import { notFound, redirect } from "next/navigation"

import { UserProfile } from "@/domains/user/components/admin/user-profile"
import {
  getAvailableRoles,
  getUserProfile,
} from "@/domains/user/services/user-management.service"
import {
  AuthorizationError,
  requirePermission,
} from "@/domains/user/utils/authorization"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    await requirePermission("user:read")
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401)
      redirect("/login")
    redirect("/dashboard")
  }
  const { id } = await params
  if (!isUuid(id)) notFound()
  const [user, roles] = await Promise.all([
    getUserProfile(id),
    getAvailableRoles(),
  ])
  if (!user) notFound()
  return <UserProfile user={user} roles={roles} />
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value)
}
