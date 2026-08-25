import { Category } from "../entities/categories.entities";
import { CategoryCard } from "../pages";
import { categoryDescriptionMap, categoryGroupMap, categoryIconMap } from "./categories-ui";

export function toCategoryCards(categories: Category[]): CategoryCard[] {
    const childCount = new Map<number, number>();

    for (const category of categories) {
        if (category.parentId == null) continue;

        childCount.set(
            category.parentId,
            (childCount.get(category.parentId) ?? 0) + 1
        );
    }
    const parentCategories = categories
        .filter(category => category.parentId === null)
        .map(parent => ({
            id: parent.id,
            name: parent.name,
            slug: parent.slug,

            group: categoryGroupMap[parent.slug] ?? "Other",

            count: childCount.get(parent.id) ?? 0,

            description:
                categoryDescriptionMap[parent.slug] ??
                "Browse products in this category.",

            iconKey:
                categoryIconMap[parent.slug] ??
                "category",
        }));
    return parentCategories
}

