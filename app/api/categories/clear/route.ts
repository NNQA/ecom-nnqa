
import { NextResponse } from "next/server";
import { clearCategories } from "@/domains/category/services/category.service";

export async function DELETE() {
    try {
        await clearCategories();

        return NextResponse.json({
            success: true,
            message: "Categories cleared.",
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to clear categories.",
            },
            {
                status: 500,
            }
        );
    }
}