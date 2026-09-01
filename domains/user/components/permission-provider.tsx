"use client"

import { createContext, useContext, type ReactNode } from "react"

import type { PermissionCode } from "../entities/auth.entities"

const PermissionContext = createContext<ReadonlySet<string> | null>(null)

export function PermissionProvider({
  permissions,
  children,
}: {
  permissions: PermissionCode[]
  children: ReactNode
}) {
  return (
    <PermissionContext.Provider value={new Set(permissions)}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermission(permission: string): boolean {
  return useContext(PermissionContext)?.has(permission) ?? false
}
