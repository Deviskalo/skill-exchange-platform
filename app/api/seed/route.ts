// app/api/seed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const categories = [
  {
    name: "Programming",
    description:
      "Learn and teach various programming languages and technologies",
    icon: "💻",
  },
  {
    name: "Design",
    description: "Graphic design, UI/UX, digital art, and creative skills",
    icon: "🎨",
  },
  {
    name: "Music",
    description:
      "Instrument playing, music theory, composition, and performance",
    icon: "🎸",
  },
  {
    name: "Language",
    description: "Foreign language learning and teaching",
    icon: "🌐",
  },
  {
    name: "Fitness",
    description: "Physical training, yoga, sports, and wellness techniques",
    icon: "💪",
  },
  {
    name: "Cooking",
    description:
      "Culinary arts, international cuisines, and cooking techniques",
    icon: "🍳",
  },
  {
    name: "Photography",
    description: "Camera techniques, editing, and visual storytelling",
    icon: "📷",
  },
  {
    name: "Business",
    description:
      "Entrepreneurship, marketing, finance, and professional skills",
    icon: "💼",
  },
  {
    name: "Art & Craft",
    description: "Painting, sculpture, knitting, and handmade crafts",
    icon: "✂️",
  },
  {
    name: "Writing",
    description: "Creative writing, copywriting, editing, and storytelling",
    icon: "✍️",
  },
  {
    name: "Personal Development",
    description: "Soft skills, communication, leadership, and self-improvement",
    icon: "🌱",
  },
  {
    name: "Technology",
    description: "IT, cybersecurity, AI, and emerging tech skills",
    icon: "🤖",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Delete existing categories to prevent duplicates
    await prisma.category.deleteMany();

    // Create new categories
    const createdCategories = await Promise.all(
      categories.map((category) =>
        prisma.category.create({
          data: {
            name: category.name,
            description: category.description,
            icon: category.icon,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Categories seeded successfully",
      categories: createdCategories,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
