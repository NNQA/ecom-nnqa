import { z } from "zod"

export const categoryIdSchema = z.coerce.number().int().positive()

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).nullable(),
  parentId: categoryIdSchema.nullable(),
  isActive: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categoryInputSchema>
