import Link from "next/link"

import type {
    UserListFilters,
    UserListResultDto,
} from "../../../dto/user-management.dto"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

export function PaginationUser({
    result,
    filters,
}: {
    result: UserListResultDto
    filters: UserListFilters
}) {
    const totalPages = Math.max(
        1,
        Math.ceil(result.total / result.pageSize)
    )

    if (!result.users.length) return null

    return (
        <nav
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            aria-label="User pagination"
        >
            <p className="text-sm text-muted-foreground">
                Showing {(result.page - 1) * result.pageSize + 1}-
                {Math.min(result.page * result.pageSize, result.total)} of{" "}
                {result.total} users
            </p>

            <div className="flex items-center gap-2">
                <PageSizeSelector
                    pageSize={result.pageSize}
                    filters={filters}
                />

                <PaginationLink
                    page={result.page - 1}
                    disabled={result.page <= 1}
                    filters={filters}
                >
                    Previous
                </PaginationLink>

                <span className="text-sm text-muted-foreground">
                    Page {result.page} of {totalPages}
                </span>

                <PaginationLink
                    page={result.page + 1}
                    disabled={result.page >= totalPages}
                    filters={filters}
                >
                    Next
                </PaginationLink>
            </div>
        </nav>
    )
}



const PAGE_SIZES = [7, 10, 20, 30, 40]

export function PageSizeSelector({
    pageSize,
    filters,
}: {
    pageSize: number
    filters: UserListFilters
}) {
    return (
        <div className="hidden items-center gap-2 lg:flex">
            <Label
                htmlFor="rows-per-page"
                className="text-sm font-medium"
            >
                Rows per page
            </Label>

            <Select value={String(pageSize)}>
                <SelectTrigger
                    size="sm"
                    className="w-20"
                    id="rows-per-page"
                >
                    <SelectValue />
                </SelectTrigger>

                <SelectContent side="top">
                    {PAGE_SIZES.map((size) => {
                        const params = new URLSearchParams()

                        if (filters.query) {
                            params.set("q", filters.query)
                        }

                        if (filters.status) {
                            params.set("status", filters.status)
                        }

                        if (filters.roleId) {
                            params.set("role", filters.roleId)
                        }

                        params.set("pageSize", String(size))

                        params.set("page", "1")

                        return (
                            <SelectItem
                                key={size}
                                value={String(size)}
                                render={
                                    <Link
                                        href={`/dashboard/users?${params.toString()}`}
                                    />
                                }
                            >
                                {size}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        </div>
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
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize))

    params.set("page", String(page))

    return (
        <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            disabled={disabled}
            render={
                <Link href={`/dashboard/users?${params.toString()}`} />
            }
        >
            {children}
        </Button>
    )
}