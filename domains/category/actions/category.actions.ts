"use server"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/domains/user/utils/authorization"
import { categoryIdSchema } from "../dto/categories.dto"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service"
type Result = { error?: string; data?: unknown }
function result(error: unknown): Result {
  return {
    error: error instanceof Error ? error.message : "Category operation failed",
  }
}
export async function createCategoryAction(input: unknown): Promise<Result> {
  try {
    await requirePermission("category:create")
    const data = await createCategory(input)
    revalidatePath("/all-categories")
    return { data }
  } catch (e) {
    return result(e)
  }
}
export async function updateCategoryAction(
  id: unknown,
  input: unknown
): Promise<Result> {
  try {
    await requirePermission("category:update")
    const data = await updateCategory(categoryIdSchema.parse(id), input)
    revalidatePath("/all-categories")
    return { data }
  } catch (e) {
    return result(e)
  }
}
export async function deleteCategoryAction(id: unknown): Promise<Result> {
  try {
    await requirePermission("category:delete")
    await deleteCategory(categoryIdSchema.parse(id))
    revalidatePath("/all-categories")
    return {}
  } catch (e) {
    return result(e)
  }
}
