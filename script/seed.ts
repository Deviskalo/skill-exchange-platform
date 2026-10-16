import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

nextEnv.loadEnvConfig(process.cwd());

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

const seedUser = {
  email: "seeded-teacher@skillswap.local",
  name: "Alex Morgan",
  bio: "A curious lifelong learner sharing practical skills with the community.",
};

const skills = [
  {
    title: "Build Your First React App",
    description:
      "Learn React fundamentals by building a small interactive app, from components and props to state and event handling.",
    category: "Programming",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    title: "Design a Clean Mobile Interface",
    description:
      "Practice layout, color, typography, and reusable components while creating a polished mobile app screen.",
    category: "Design",
    tags: ["UI/UX", "Figma", "Mobile Design"],
  },
  {
    title: "Beginner Acoustic Guitar",
    description:
      "Get comfortable with basic chords, simple strumming patterns, and a few approachable songs on acoustic guitar.",
    category: "Music",
    tags: ["Guitar", "Beginner", "Chords"],
  },
  {
    title: "Practice Conversational Spanish",
    description:
      "Build confidence with everyday Spanish conversation, useful vocabulary, and pronunciation practice.",
    category: "Language",
    tags: ["Spanish", "Conversation", "Pronunciation"],
  },
  {
    title: "At-Home Mobility and Stretching",
    description:
      "Learn a gentle mobility routine for improving flexibility and moving more comfortably throughout the day.",
    category: "Fitness",
    tags: ["Mobility", "Stretching", "Wellness"],
  },
  {
    title: "Easy Weeknight Meal Prep",
    description:
      "Plan and prepare simple, balanced meals for the week while learning foundational knife and cooking techniques.",
    category: "Cooking",
    tags: ["Meal Prep", "Cooking", "Beginner"],
  },
  {
    title: "Portrait Photography Basics",
    description:
      "Use natural light, composition, and simple camera settings to take more expressive portraits.",
    category: "Photography",
    tags: ["Portraits", "Lighting", "Composition"],
  },
  {
    title: "Create a Simple Business Plan",
    description:
      "Turn an early business idea into a practical plan with a target audience, value proposition, and first milestones.",
    category: "Business",
    tags: ["Entrepreneurship", "Planning", "Strategy"],
  },
  {
    title: "Watercolor Painting for Beginners",
    description:
      "Explore basic watercolor materials, washes, color mixing, and a few techniques for painting a small landscape.",
    category: "Art & Craft",
    tags: ["Watercolor", "Painting", "Beginner"],
  },
  {
    title: "Write a Compelling Short Story",
    description:
      "Develop a memorable character and a clear story arc, then revise a short draft for stronger pacing and detail.",
    category: "Writing",
    tags: ["Creative Writing", "Storytelling", "Editing"],
  },
  {
    title: "Confident Public Speaking",
    description:
      "Practice structuring a short talk, managing nerves, and using clear delivery to connect with an audience.",
    category: "Personal Development",
    tags: ["Communication", "Presentation", "Confidence"],
  },
  {
    title: "Everyday Cybersecurity Essentials",
    description:
      "Learn practical ways to protect your accounts and devices with password managers, multi-factor authentication, and safer browsing habits.",
    category: "Technology",
    tags: ["Cybersecurity", "Online Safety", "Technology"],
  },
];

async function main() {
  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const seededCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        icon: category.icon,
      },
      create: category,
    });
    categoryIds.set(category.name, seededCategory.id);
  }

  const user = await prisma.user.upsert({
    where: { email: seedUser.email },
    update: {},
    create: seedUser,
  });

  for (const skill of skills) {
    const categoryId = categoryIds.get(skill.category);
    if (!categoryId) {
      throw new Error(`Missing category for seeded skill: ${skill.title}`);
    }

    const existingSkill = await prisma.skill.findFirst({
      where: { title: skill.title, userId: user.id },
      select: { id: true },
    });

    if (existingSkill) {
      await prisma.skill.update({
        where: { id: existingSkill.id },
        data: {
          description: skill.description,
          categoryId,
          tags: skill.tags,
        },
      });
    } else {
      await prisma.skill.create({
        data: {
          title: skill.title,
          description: skill.description,
          categoryId,
          tags: skill.tags,
          userId: user.id,
        },
      });
    }
  }

  console.log(`Seeded ${categories.length} categories and ${skills.length} skills.`);
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
