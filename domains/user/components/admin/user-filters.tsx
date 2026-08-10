import Link from "next/link"

import type {
  UserListFilters,
  UserManagementRoleDto,
} from "../../dto/user-management.dto"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

export function UserFilters({
  filters,
  roles,
}: {
  filters: UserListFilters
  roles: UserManagementRoleDto[]
}) {
  return (
    <form
      className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_12rem_auto]"
      method="get"
    >
      <Input
        name="q"
        defaultValue={filters.query}
        placeholder="Search users..."
        aria-label="Search users by name or email"
      />
      <select
        name="status"
        defaultValue={filters.status ?? ""}
        className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="BANNED">Banned</option>
      </select>
      <select
        name="role"
        defaultValue={filters.roleId ?? ""}
        className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">All roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button type="submit">Apply</Button>
        {(filters.query || filters.status || filters.roleId) && (
          <Button variant="outline" render={<Link href="/dashboard/users" />}>
            Clear
          </Button>
        )}
      </div>
    </form>
  )
}
