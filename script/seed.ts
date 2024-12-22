// scripts/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  // Clear existing categories
  await prisma.category.deleteMany();

  // Seed new categories
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
    });
  }

  console.log("Categories seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
