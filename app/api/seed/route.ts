import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants/categories";

export async function GET() {
  try {
    // Seed categories
    for (const category of CATEGORIES) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: {
          name: category.name,
          description: category.description,
          icon: category.icon,
        },
      });
    }

    return NextResponse.json({ message: "Categories seeded successfully" });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}
