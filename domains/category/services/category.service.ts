import { categorySeed } from "../data/categories.seed";
import { getAllCategories, insertCategory, truncateCategories } from "../repositories/categories.repositories";

export async function seedCategories() {
    for (const category of categorySeed) {
        const parent = await insertCategory({
            name: category.name,
            slug: category.slug,
            parent_id: null,
        });


        for (const child of category.children) {
            await insertCategory({
                name: child.name,
                slug: child.slug,
                parent_id: parent.id,
            });
        }
    }
}


export async function clearCategories() {
    await truncateCategories();
}

export async function getCategories() {
    return await getAllCategories();
}