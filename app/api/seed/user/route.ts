import { NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth/server-auth"
import { getDb } from "@/shared/lib/db/db.server"

const users = [
  {
    email: "superadmin@gmail.com",
    password: "Admin@123456",
    firstName: "Super",
    lastName: "Administrator",
    role: "SUPER_ADMIN",
  },

  ...Array.from({ length: 10 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0")

    return {
      email: `user${number}@gmail.com`,
      password: "User@123456",
      firstName: "User",
      lastName: number,
      role: "CUSTOMER",
    }
  }),
]

const permissions = [
  {
    code: "category:read",
    name: "Read categories",
    description: "View category data",
  },
  {
    code: "category:create",
    name: "Create categories",
    description: "Create categories",
  },
  {
    code: "category:update",
    name: "Update categories",
    description: "Update categories",
  },
  {
    code: "category:delete",
    name: "Delete categories",
    description: "Delete categories",
  },

  {
    code: "order:read",
    name: "Read orders",
    description: "View orders",
  },
  {
    code: "order:manage",
    name: "Manage orders",
    description: "Create and update orders",
  },

  {
    code: "user:manage",
    name: "Manage users",
    description: "Manage users and their roles",
  },
  {
    code: "user:read",
    name: "Read users",
    description: "View user administration data",
  },
  {
    code: "user:update",
    name: "Update users",
    description: "Update application user profiles",
  },
  {
    code: "user:ban",
    name: "Ban users",
    description: "Change application account status",
  },
  {
    code: "user:role:assign",
    name: "Assign user roles",
    description: "Assign roles to users",
  },
  {
    code: "user:role:remove",
    name: "Remove user roles",
    description: "Remove roles from users",
  },
]

// ============================================================
// 3. ROLES
// ============================================================

const roles = [
  {
    code: "SUPER_ADMIN",
    name: "Super Administrator",
    description:
      "Highest privilege. Manages the entire platform, security, roles, permissions, system configuration, and all business operations.",
    isSystem: true,
  },
  {
    code: "CUSTOMER",
    name: "Customer",
    description:
      "Regular customer who can browse products, place orders, and manage their own account.",
    isSystem: true,
  },
]

export async function GET() {
  const { error } = await auth.signUp.email({
    email: "superadmin@gmail.com",
    password: "Admin@123456",
    name: "admin",
  })
  return Response.json({ success: !error, error })
}
