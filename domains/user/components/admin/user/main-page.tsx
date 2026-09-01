import {
  UserListFilters,
  UserListResultDto,
  UserManagementRoleDto,
} from "@/domains/user/dto/user-management.dto"
import { TableManageUser } from "./table-manage-user"
import { UserFilters } from "./user-filters"
import { PaginationUser } from "./pagination-user"

export function UsersPage({
  result,
  filters,
  roles,
}: {
  result: UserListResultDto
  filters: UserListFilters
  roles: UserManagementRoleDto[]
}) {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-10 py-2">
      <header>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, profiles, roles and account status.
        </p>
      </header>
      <div className="space-y-4">
        <UserFilters filters={filters} roles={roles} />

        <TableManageUser result={result} filters={filters} roles={roles} />
        <PaginationUser result={result} filters={filters} />
      </div>
    </main>
  )
}
