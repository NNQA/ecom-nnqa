import { truncateCategories } from "@/domains/category/repositories/categories.repositories";
import { clearCategories, seedCategories } from "@/domains/category/services/category.service";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await clearCategories();
        await seedCategories();

        return NextResponse.json({
            success: true,
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: err,
            },
            {
                status: 500,
            }
        );
    }
}