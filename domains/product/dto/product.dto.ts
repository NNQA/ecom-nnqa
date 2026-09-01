import { z } from "zod"
export const productIdSchema = z.coerce.number().int().positive()
export const productVariantSchema = z.object({
  sku: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().url().nullable(),
})
export const productInputSchema = z.object({
  shopId: productIdSchema.nullable(),
  categoryId: productIdSchema,
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).nullable(),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  images: z.array(z.string().url()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  variants: z.array(productVariantSchema).default([]),
})
export type ProductInput = z.infer<typeof productInputSchema>
export type ProductFilters = {
  categoryId?: number
  status?: ProductInput["status"]
  query?: string
  minPrice?: number
  maxPrice?: number
  sort?: "newest" | "price_asc" | "price_desc"
  page?: number
  pageSize?: number
}
