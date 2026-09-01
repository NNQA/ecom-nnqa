import "server-only"

import { getDb } from "@/shared/lib/db/db.server"
import type { CategoryInput } from "../dto/categories.dto"
import type { Category } from "../entities/categories.entities"

type CategoryRow = {
  id: number
  name: string
  slug: string
  description: string | null
  parentId: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
function mapCategory(row: CategoryRow): Category {
  return row
}
export async function findMany(): Promise<Category[]> {
  const sql = getDb()
  return (
    await sql<
      CategoryRow[]
    >`SELECT id,name,slug,description,parent_id AS "parentId",is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt" FROM categories ORDER BY parent_id NULLS FIRST,name`
  ).map(mapCategory)
}
export async function findById(id: number): Promise<Category | null> {
  const sql = getDb()
  const [row] = await sql<
    CategoryRow[]
  >`SELECT id,name,slug,description,parent_id AS "parentId",is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt" FROM categories WHERE id=${id}`
  return row ? mapCategory(row) : null
}
export async function findBySlug(slug: string): Promise<Category | null> {
  const sql = getDb()
  const [row] = await sql<
    CategoryRow[]
  >`SELECT id,name,slug,description,parent_id AS "parentId",is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt" FROM categories WHERE slug=${slug}`
  return row ? mapCategory(row) : null
}
export async function create(
  input: CategoryInput & { slug: string }
): Promise<Category> {
  const sql = getDb()
  const [row] = await sql<
    CategoryRow[]
  >`INSERT INTO categories (name,slug,description,parent_id,is_active) VALUES (${input.name},${input.slug},${input.description},${input.parentId},${input.isActive}) RETURNING id,name,slug,description,parent_id AS "parentId",is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt"`
  return mapCategory(row)
}
export async function update(
  id: number,
  input: CategoryInput & { slug: string }
): Promise<Category> {
  const sql = getDb()
  const [row] = await sql<
    CategoryRow[]
  >`UPDATE categories SET name=${input.name},slug=${input.slug},description=${input.description},parent_id=${input.parentId},is_active=${input.isActive},updated_at=NOW() WHERE id=${id} RETURNING id,name,slug,description,parent_id AS "parentId",is_active AS "isActive",created_at AS "createdAt",updated_at AS "updatedAt"`
  if (!row) throw new Error("Category not found")
  return mapCategory(row)
}
export async function deleteCategory(id: number): Promise<void> {
  await getDb()`DELETE FROM categories WHERE id=${id}`
}
export async function hasChildren(id: number): Promise<boolean> {
  const sql = getDb()
  const [row] = await sql<
    { exists: boolean }[]
  >`SELECT EXISTS(SELECT 1 FROM categories WHERE parent_id=${id})`
  return row?.exists ?? false
}
export async function hasProducts(id: number): Promise<boolean> {
  const sql = getDb()
  const [row] = await sql<
    { exists: boolean }[]
  >`SELECT EXISTS(SELECT 1 FROM products WHERE category_id=${id})`
  return row?.exists ?? false
}
export const insertCategory = async (input: {
  parent_id: number | null
  name: string
  slug: string
}) =>
  create({
    name: input.name,
    slug: input.slug,
    description: null,
    parentId: input.parent_id,
    isActive: true,
  })
export const getAllCategories = findMany
export async function truncateCategories(): Promise<void> {
  await getDb()`TRUNCATE TABLE categories RESTART IDENTITY`
}
