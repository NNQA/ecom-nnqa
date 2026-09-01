import type { ReactNode } from "react"

import { getCurrentUserId } from "../utils/authorization"
import { hasPermission } from "../services/authorization.service"

type PermissionGateProps = {
  permission: string
  children: ReactNode
  fallback?: ReactNode
  userId?: string
}

export async function PermissionGate({
  permission,
  children,
  fallback = null,
  userId,
}: PermissionGateProps) {
  try {
    const resolvedUserId = userId ?? (await getCurrentUserId())
    return (await hasPermission(resolvedUserId, permission))
      ? children
      : fallback
  } catch {
    return fallback
  }
}
