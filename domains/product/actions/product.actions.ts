"use server"
import { revalidatePath } from "next/cache"
import { requirePermission } from "@/domains/user/utils/authorization"
import { productIdSchema } from "../dto/product.dto"
import { createProduct, updateProduct, deleteProduct } from "../product.service"
type Result = { error?: string; data?: unknown }
const fail = (e: unknown): Result => ({
  error: e instanceof Error ? e.message : "Product operation failed",
})
export async function createProductAction(input: unknown): Promise<Result> {
  try {
    await requirePermission("product:create")
    const data = await createProduct(input)
    revalidatePath("/")
    return { data }
  } catch (e) {
    return fail(e)
  }
}
export async function updateProductAction(
  id: unknown,
  input: unknown
): Promise<Result> {
  try {
    await requirePermission("product:update")
    const data = await updateProduct(productIdSchema.parse(id), input)
    revalidatePath("/")
    return { data }
  } catch (e) {
    return fail(e)
  }
}
export async function deleteProductAction(id: unknown): Promise<Result> {
  try {
    await requirePermission("product:delete")
    await deleteProduct(productIdSchema.parse(id))
    revalidatePath("/")
    return {}
  } catch (e) {
    return fail(e)
  }
}
