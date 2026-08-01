import { useDb } from "@/shared/lib/db/db.cli";
import { CategoryDto } from "../dto/categories.dto";
import { Category } from "../entities/categories.entities";


export async function insertCategory(data: CategoryDto) {
    try {
        const sql = useDb();
        const [category] = await sql<
            {
                id: number;
                parent_id: number | null;
                name: string;
                slug: string;
            }[]
        >`
        INSERT INTO categories (parent_id, name, slug)
        VALUES (${data.parent_id}, ${data.name}, ${data.slug})
        RETURNING id, parent_id, name, slug;
      `;
        return category;
    } catch (error) {
        throw error
    }
}


export async function deleteAllCategories(): Promise<void> {
    const sql = useDb();
    await sql`
        DELETE FROM categories;
    `;
}

export async function truncateCategories(): Promise<void> {
    const sql = useDb();
    await sql`
        TRUNCATE TABLE categories
        RESTART IDENTITY
        CASCADE;
    `;
}

export async function getAllCategories(): Promise<Category[]> {
    const sql = useDb();
    return await sql<Category[]>`
    SELECT
      id,
      parent_id,
      name,
      slug
    FROM categories
    ORDER BY
      parent_id NULLS FIRST,
      name;
  `;
}