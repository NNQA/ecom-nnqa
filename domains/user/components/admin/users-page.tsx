import Link from "next/link"

import type {
  UserListFilters,
  UserListResultDto,
  UserManagementRoleDto,
} from "../../dto/user-management.dto"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { UserActions } from "./user-actions"
import { UserFilters } from "./user-filters"
import { UserStatusBadge } from "./user-status-badge"

export function UsersPage({
  result,
  filters,
  roles,
}: {
  result: UserListResultDto
  filters: UserListFilters
  roles: UserManagementRoleDto[]
}) {
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, profiles, roles and account status.
        </p>
      </header>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>User directory</CardTitle>
          <CardDescription>
            {result.total} user{result.total === 1 ? "" : "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <UserFilters filters={filters} roles={roles} />
          {result.users.length === 0 ? (
            <div className="py-14 text-center">
              <p className="font-medium">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                There are no users matching your current filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                render={<Link href="/dashboard/users" />}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead aria-label="Actions" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/users/${user.id}`}
                            className="flex items-center gap-3"
                          >
                            <Avatar>
                              <AvatarImage
                                src={user.avatarUrl ?? undefined}
                                alt=""
                              />
                              <AvatarFallback>
                                {initials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <RoleBadges roles={user.roles} />
                        </TableCell>
                        <TableCell>
                          <UserStatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <UserActions
                            user={{
                              ...user,
                              firstName: null,
                              lastName: null,
                              phone: null,
                            }}
                            roles={roles}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="divide-y md:hidden">
                {result.users.map((user) => (
                  <article key={user.id} className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="min-w-0 flex-1"
                      >
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </Link>
                      <UserActions
                        user={{
                          ...user,
                          firstName: null,
                          lastName: null,
                          phone: null,
                        }}
                        roles={roles}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <RoleBadges roles={user.roles} />
                      <UserStatusBadge status={user.status} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">
                  Page {result.page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <PaginationLink
                    page={result.page - 1}
                    disabled={result.page <= 1}
                    filters={filters}
                  >
                    Previous
                  </PaginationLink>
                  <PaginationLink
                    page={result.page + 1}
                    disabled={result.page >= totalPages}
                    filters={filters}
                  >
                    Next
                  </PaginationLink>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function RoleBadges({ roles }: { roles: UserManagementRoleDto[] }) {
  return roles.length ? (
    <span className="flex flex-wrap gap-1">
      {roles.slice(0, 2).map((role) => (
        <span
          key={role.id}
          className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium"
        >
          {role.code}
        </span>
      ))}
      {roles.length > 2 && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
          +{roles.length - 2}
        </span>
      )}
    </span>
  ) : (
    <span className="text-sm text-muted-foreground">No roles</span>
  )
}
function PaginationLink({
  page,
  disabled,
  filters,
  children,
}: {
  page: number
  disabled: boolean
  filters: UserListFilters
  children: React.ReactNode
}) {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query)
  if (filters.status) params.set("status", filters.status)
  if (filters.roleId) params.set("role", filters.roleId)
  params.set("page", String(page))
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      render={<Link href={`/dashboard/users?${params}`} />}
    >
      {children}
    </Button>
  )
}
function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  )
}
function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value)
}
