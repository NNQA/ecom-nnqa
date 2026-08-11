import type { UserStatus } from "../../../entities/auth.entities"

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const className =
    status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : "bg-rose-500/10 text-rose-700 dark:text-rose-400"

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {status === "ACTIVE" ? "Active" : "Banned"}
    </span>
  )
}
