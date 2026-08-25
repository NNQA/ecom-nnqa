import "server-only"
import { categoryInputSchema, categoryIdSchema, type CategoryInput } from "../dto/categories.dto"
import * as repo from "../repositories/categories.repositories"

function slugify(value: string) { return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "category" }
async function uniqueSlug(name: string, currentId?: number) { const base = slugify(name); let slug = base; let n = 2; while (true) { const found = await repo.findBySlug(slug); if (!found || found.id === currentId) return slug; slug = `${base}-${n++}` } }
async function validateParent(parentId: number | null, currentId?: number) { if (parentId === null) return; const parent = await repo.findById(parentId); if (!parent) throw new Error("Parent category not found"); if (parent.parentId !== null) throw new Error("Categories may only have one level of children"); if (parent.id === currentId) throw new Error("A category cannot be its own parent") }
function parse(input: unknown): CategoryInput { return categoryInputSchema.parse(input) }
export const getCategories = () => repo.findMany()
export const getCategoryById = async (id: unknown) => repo.findById(categoryIdSchema.parse(id))
export const getCategoryBySlug = (slug: string) => repo.findBySlug(slug)
export async function createCategory(input: unknown) { const data = parse(input); await validateParent(data.parentId); return repo.create({ ...data, slug: await uniqueSlug(data.name) }) }
export async function updateCategory(id: unknown, input: unknown) { const categoryId = categoryIdSchema.parse(id); if (!await repo.findById(categoryId)) throw new Error("Category not found"); const data = parse(input); await validateParent(data.parentId, categoryId); return repo.update(categoryId, { ...data, slug: await uniqueSlug(data.name, categoryId) }) }
export async function deleteCategory(id: unknown) { const categoryId = categoryIdSchema.parse(id); if (!await repo.findById(categoryId)) throw new Error("Category not found"); if (await repo.hasChildren(categoryId)) throw new Error("Cannot delete a category with children"); if (await repo.hasProducts(categoryId)) throw new Error("Cannot delete a category referenced by products"); return repo.deleteCategory(categoryId) }
import { categorySeed } from "../data/categories.seed"
export async function seedCategories() { for (const item of categorySeed) { const parent = await createCategory({ name: item.name, description: null, parentId: null, isActive: true }); for (const child of item.children) await createCategory({ name: child.name, description: null, parentId: parent.id, isActive: true }) } }
export async function clearCategories() { const repoModule = await import("../repositories/categories.repositories"); await repoModule.truncateCategories() }

