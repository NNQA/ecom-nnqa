import { NextResponse } from "next/server";
import { getCategories } from "@/domains/category/services/category.service";

export async function GET() {
    try {
        const categories = await getCategories();

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch categories.",
            },
            {
                status: 500,
            }
        );
    }
}