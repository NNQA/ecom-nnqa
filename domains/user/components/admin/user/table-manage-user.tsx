"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  columnVisibilityFeature,
  createColumnHelper,
  rowSelectionFeature,
  tableFeatures,
  useTable,
  type ColumnVisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table"

import type {
  UserListFilters,
  UserListItemDto,
  UserListResultDto,
  UserManagementRoleDto,
  UserProfileDto,
} from "../../../dto/user-management.dto"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { UserActions } from "./user-actions"
import { UserStatusBadge } from "./user-status-badge"

const features = tableFeatures({
  columnVisibilityFeature,
  rowSelectionFeature,
})
const columnHelper = createColumnHelper<typeof features, UserListItemDto>()

export function TableManageUser({
  result,
  filters,
  roles,
}: {
  result: UserListResultDto
  filters: UserListFilters
  roles: UserManagementRoleDto[]
}) {
  void filters

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({})
  const columns = useMemo(() => createColumns(roles), [roles])
  const table = useTable({
    features,
    columns,
    data: result.users,
    getRowId: (user) => user.id,
    enableRowSelection: true,
    state: { rowSelection, columnVisibility },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  })

  if (!result.users.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="font-medium">No users found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try changing the current filters to find an account.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted pl-4">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="pl-4">
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function createColumns(roles: UserManagementRoleDto[]) {
  return columnHelper.columns([
    columnHelper.display({
      id: "select",
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(checked === true)
          }
          aria-label="Select all users"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(checked === true)}
          aria-label={`Select ${row.original.name}`}
        />
      ),
    }),

    columnHelper.accessor("id", {
      id: "id",
      header: "Id",
      enableHiding: false,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("name", {
      id: "user",
      header: "User",
      enableHiding: false,
      cell: ({ row }) => <UserCell user={row.original} />,
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      cell: ({ getValue }) => <RoleCell roles={getValue()} />,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <UserStatusBadge status={getValue()} />,
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions user={row.original} roles={roles} />,
    }),
  ])
}

function UserCell({ user }: { user: UserListItemDto }) {
  return (
    <Link
      href={`/dashboard/users/${user.id}`}
      className="flex min-w-56 items-center gap-3"
    >
      <Avatar className="size-9">
        <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </span>
    </Link>
  )
}
function RoleCell({ roles }: { roles: UserManagementRoleDto[] }) {
  if (!roles.length) {
    return <span className="text-muted-foreground">No roles</span>
  }

  const role = roles[0]

  const roleClassName =
    {
      SUPER_ADMIN:
        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
      ADMIN:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      SELLER: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
      CUSTOMER:
        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-400",
    }[role.code] ?? "bg-muted text-muted-foreground"

  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${roleClassName}`}
      >
        {role.code}
      </span>

      {roles.length > 1 && (
        <span className="text-xs text-muted-foreground">
          +{roles.length - 1}
        </span>
      )}
    </span>
  )
}

function RowActions({
  user,
  roles,
}: {
  user: UserListItemDto
  roles: UserManagementRoleDto[]
}) {
  const actionUser = {
    ...user,
    firstName: null,
    lastName: null,
    phone: null,
  } satisfies Pick<
    UserProfileDto,
    | "id"
    | "name"
    | "email"
    | "firstName"
    | "lastName"
    | "phone"
    | "avatarUrl"
    | "status"
    | "roles"
  >

  return <UserActions user={actionUser} roles={roles} />
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
