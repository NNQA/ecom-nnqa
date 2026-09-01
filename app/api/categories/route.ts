import { NextResponse } from "next/server"
import { getCategories } from "@/domains/category/services/category.service"
import {
  requirePermission,
  AuthorizationError,
} from "@/domains/user/utils/authorization"
export async function GET() {
  try {
    await requirePermission("category:read")
    return NextResponse.json({ success: true, data: await getCategories() })
  } catch (error) {
    const status = error instanceof AuthorizationError ? error.status : 500
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch categories.",
      },
      { status }
    )
  }
}
