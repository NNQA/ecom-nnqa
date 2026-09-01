// import { runSeed } from "@/seed";
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // await runSeed();
    return NextResponse.json({ message: "Seed completed successfully." })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Seed failed. Check server logs." },
      { status: 500 }
    )
  }
}
