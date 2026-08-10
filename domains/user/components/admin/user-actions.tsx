"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconBan,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconShieldMinus,
  IconUserCheck,
} from "@tabler/icons-react"

import type {
  UserManagementRoleDto,
  UserProfileDto,
} from "../../dto/user-management.dto"
import {
  assignUserRoleAction,
  removeUserRoleAction,
  setUserStatusAction,
  updateUserProfileAction,
} from "../../actions/user-management.actions"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet"

type ActionMode = "edit" | "assign" | "remove" | "status" | null

type UserActionsProps = {
  user: Pick<
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
  roles: UserManagementRoleDto[]
  label?: boolean
}

export function UserActions({ user, roles, label = false }: UserActionsProps) {
  const router = useRouter()
  const [mode, setMode] = useState<ActionMode>(null)
  const [selectedRole, setSelectedRole] =
    useState<UserManagementRoleDto | null>(null)
  const [isPending, startTransition] = useTransition()
  const assignableRoles = roles.filter(
    (role) => !user.roles.some((userRole) => userRole.id === role.id)
  )

  function runAction(
    formData: FormData,
    action: (data: FormData) => Promise<{ error?: string; message?: string }>
  ) {
    startTransition(async () => {
      const result = await action(formData)
      if (result.error) toast.error(result.error)
      else {
        toast.success(result.message ?? "Updated")
        setMode(null)
        setSelectedRole(null)
        router.refresh()
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size={label ? "sm" : "icon-sm"}
              aria-label={`Manage ${user.name}`}
            />
          }
        >
          {label ? "Actions" : <IconDotsVertical />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${user.id}`)}
          >
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("edit")}>
            <IconEdit />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!assignableRoles.length}
            onClick={() => setMode("assign")}
          >
            <IconPlus />
            Assign role
          </DropdownMenuItem>
          {user.roles.length > 0 && <DropdownMenuSeparator />}
          {user.roles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              onClick={() => {
                setSelectedRole(role)
                setMode("remove")
              }}
            >
              <IconShieldMinus />
              Remove {role.code}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant={user.status === "ACTIVE" ? "destructive" : "default"}
            onClick={() => setMode("status")}
          >
            {user.status === "ACTIVE" ? <IconBan /> : <IconUserCheck />}
            {user.status === "ACTIVE" ? "Ban user" : "Unban user"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet
        open={mode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMode(null)
            setSelectedRole(null)
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md"
        >
          {mode === "edit" && (
            <>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Update application profile information. Authentication
                  credentials are not exposed here.
                </SheetDescription>
              </SheetHeader>
              <form
                className="space-y-4 p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction(
                    new FormData(event.currentTarget),
                    updateUserProfileAction
                  )
                }}
              >
                <input type="hidden" name="userId" value={user.id} />
                <Field
                  label="First name"
                  name="firstName"
                  defaultValue={user.firstName ?? ""}
                />
                <Field
                  label="Last name"
                  name="lastName"
                  defaultValue={user.lastName ?? ""}
                />
                <Field
                  label="Phone"
                  name="phone"
                  defaultValue={user.phone ?? ""}
                />
                <Field
                  label="Avatar URL"
                  name="avatarUrl"
                  defaultValue={user.avatarUrl ?? ""}
                  type="url"
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </>
          )}
          {mode === "assign" && (
            <>
              <SheetHeader>
                <SheetTitle>Assign role</SheetTitle>
                <SheetDescription>
                  Only roles the user does not already have are available.
                </SheetDescription>
              </SheetHeader>
              <form
                className="space-y-4 p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction(
                    new FormData(event.currentTarget),
                    assignUserRoleAction
                  )
                }}
              >
                <input type="hidden" name="userId" value={user.id} />
                <Label htmlFor="roleId">Role</Label>
                <select
                  id="roleId"
                  name="roleId"
                  required
                  className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {assignableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Assigning..." : "Assign role"}
                </Button>
              </form>
            </>
          )}
          {mode === "remove" && selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle>Remove role?</SheetTitle>
                <SheetDescription>
                  Remove {selectedRole.code} from {user.name}? This may reduce
                  their access.
                </SheetDescription>
              </SheetHeader>
              <form
                className="space-y-4 p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction(
                    new FormData(event.currentTarget),
                    removeUserRoleAction
                  )
                }}
              >
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="roleId" value={selectedRole.id} />
                <input
                  type="hidden"
                  name="roleCode"
                  value={selectedRole.code}
                />
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPending}
                >
                  {isPending ? "Removing..." : "Remove role"}
                </Button>
              </form>
            </>
          )}
          {mode === "status" && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {user.status === "ACTIVE" ? "Ban user?" : "Unban user?"}
                </SheetTitle>
                <SheetDescription>
                  {user.status === "ACTIVE"
                    ? `${user.name} will no longer be able to use the platform.`
                    : `Restore access for ${user.name}.`}
                </SheetDescription>
              </SheetHeader>
              <form
                className="space-y-4 p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction(
                    new FormData(event.currentTarget),
                    setUserStatusAction
                  )
                }}
              >
                <input type="hidden" name="userId" value={user.id} />
                <input
                  type="hidden"
                  name="status"
                  value={user.status === "ACTIVE" ? "BANNED" : "ACTIVE"}
                />
                <Button
                  type="submit"
                  variant={user.status === "ACTIVE" ? "destructive" : "default"}
                  disabled={isPending}
                >
                  {isPending
                    ? "Updating..."
                    : user.status === "ACTIVE"
                      ? "Ban user"
                      : "Unban user"}
                </Button>
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  )
}
