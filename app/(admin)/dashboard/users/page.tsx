import { UsersPage } from "@/domains/user/components/admin/user/main-page"
import {
  getAvailableRoles,
  getUsers,
} from "@/domains/user/services/user-management.service"
import type { UserListFilters } from "@/domains/user/dto/user-management.dto"
import {
  AuthorizationError,
  requirePermission,
} from "@/domains/user/utils/authorization"
import { redirect } from "next/navigation"

type SearchParams = Promise<{
  q?: string
  status?: string
  role?: string
  page?: string
  pageSize?: number
}>

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await authorizeUserRead()
  const params = await searchParams
  const filters: UserListFilters = {
    query: params.q?.trim() || undefined,
    status:
      params.status === "ACTIVE" || params.status === "BANNED"
        ? params.status
        : undefined,
    roleId: isUuid(params.role) ? params.role : undefined,
    page: Math.max(Number(params.page) || 1, 1),
    pageSize: params.pageSize ?? 7
  }
  const [result, roles] = await Promise.all([
    getUsers(filters),
    getAvailableRoles(),
  ])
  return <UsersPage result={result} filters={filters} roles={roles} />
}

function isUuid(value: string | undefined): value is string {
  return /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value ?? "")
}

async function authorizeUserRead() {
  try {
    await requirePermission("user:read")
  } catch (error) {
    if (error instanceof AuthorizationError && error.status === 401)
      redirect("/login")
    redirect("/dashboard")
  }
}
