import Link from "next/link"

import type {
  UserManagementRoleDto,
  UserProfileDto,
} from "../../../dto/user-management.dto"
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
import { UserActions } from "./user-actions"
import { UserStatusBadge } from "./user-status-badge"

export function UserProfile({
  user,
  roles,
}: {
  user: UserProfileDto
  roles: UserManagementRoleDto[]
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-6 lg:py-8">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/dashboard/users" />}
      >
        Back to users
      </Button>
      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Application profile, roles and account status.
          </p>
        </div>
        <UserActions user={user} roles={roles} label />
      </header>
      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)]">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="mt-2">
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
            <Info label="First name" value={user.firstName} />
            <Info label="Last name" value={user.lastName} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phone} />
            <Info label="Created" value={formatDate(user.createdAt)} />
            <Info label="Updated" value={formatDate(user.updatedAt)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Roles</CardTitle>
            <CardDescription>Assigned access roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-5">
            {user.roles.length ? (
              user.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{role.code}</p>
                    <p className="text-xs text-muted-foreground">{role.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No roles assigned.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value || "Not provided"}</p>
    </div>
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
