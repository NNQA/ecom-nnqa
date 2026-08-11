"use client"

import { Check, ChevronDown, ListFilter, Search, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import type {
  UserListFilters,
  UserManagementRoleDto,
} from "../../../dto/user-management.dto"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", dotClassName: "bg-emerald-500" },
  { value: "BANNED", label: "Banned", dotClassName: "bg-red-500" },
] as const

export function UserFilters({
  filters,
  roles,
}: {
  filters: UserListFilters
  roles: UserManagementRoleDto[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(filters.query ?? "")

  const hasActiveFilters = Boolean(
    filters.query || filters.status || filters.roleId,
  )

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === filters.status)
  const selectedRole = roles.find((role) => role.id === filters.roleId)

  function navigate(next: {
    q?: string
    status?: string | null
    role?: string | null
  }) {
    console.log("navigate called", next)
    const params = new URLSearchParams()
    const merged = {
      q: next.q !== undefined ? next.q : (filters.query ?? ""),
      status:
        next.status !== undefined ? next.status : (filters.status ?? ""),
      role: next.role !== undefined ? next.role : (filters.roleId ?? ""),
    }
    if (merged.q) params.set("q", merged.q)
    if (merged.status) params.set("status", merged.status)
    if (merged.role) params.set("role", merged.role)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <form
        className="relative flex-1 max-w-72"
        onSubmit={(e) => {
          e.preventDefault()
          navigate({ q: query })
        }}
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          aria-label="Search users by name or email"
          className="h-9 pl-8"
        />
      </form>

      <div className="space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 border-dashed"
              >
                {selectedStatus ? (
                  <span
                    className={`size-1.5 rounded-full ${selectedStatus.dotClassName}`}
                  />
                ) : (
                  <ListFilter className="size-3.5 text-muted-foreground" />
                )}
                <span>Status{selectedStatus ? `: ${selectedStatus.label}` : ""}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          >
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem
              onClick={() => navigate({ status: null })}
              className="justify-between"
            >
              All statuses
              {!filters.status && <Check className="size-3.5" />}
            </DropdownMenuItem>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => navigate({ status: option.value })}
                className="justify-between"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`size-1.5 rounded-full ${option.dotClassName}`}
                  />
                  {option.label}
                </span>
                {filters.status === option.value && (
                  <Check className="size-3.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 border-dashed"
              >
                <ListFilter className="size-3.5 text-muted-foreground" />
                <span>Role{selectedRole ? `: ${selectedRole.name}` : ""}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          >
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onSelect={() => navigate({ role: null })}
              className="justify-between"
            >
              All roles
              {!filters.roleId && <Check className="size-3.5" />}
            </DropdownMenuItem>
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => navigate({ role: role.id })}
                className="justify-between"
              >
                {role.name}
                {filters.roleId === role.id && <Check className="size-3.5" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 text-muted-foreground"
          onClick={() => {
            setQuery("")
            router.push(pathname)
          }}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      </div>
    </div>
  )
}