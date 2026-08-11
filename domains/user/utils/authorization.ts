import "server-only"

import { auth } from "@/shared/lib/auth/server-auth"

import { hasPermission } from "../services/authorization.service"

export class AuthorizationError extends Error {
  constructor(
    message: string,
    readonly status: 401 | 403
  ) {
    super(message)
    this.name = "AuthorizationError"
  }
}

export type AuthorizedActionContext = { userId: string }

export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await auth.getSession()
  const userId = data?.user?.id

  if (error || !userId) {
    throw new AuthorizationError("Authentication is required.", 401)
  }

  return userId
}

export async function requirePermission(
  permission: string
): Promise<AuthorizedActionContext> {
  const userId = await getCurrentUserId()
  const permitted = await hasPermission(userId, permission)

  if (!permitted) {
    throw new AuthorizationError(
      `Missing required permission: ${permission}`,
      403
    )
  }

  return { userId }
}

export function withPermission<TArgs extends unknown[], TResult>(
  permission: string,
  actionFn: (
    context: AuthorizedActionContext,
    ...args: TArgs
  ) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    return actionFn(await requirePermission(permission), ...args)
  }
}
