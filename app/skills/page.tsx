import { SkillsClientView } from "@/components/skills/skills-client-view";
import { prisma } from "@/lib/prisma";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const processedSkills = skills.map((skill) => ({
    ...skill,
    name: skill.user.name ?? "Unknown User",
    category: skill.category.name,
    user: {
      name: skill.user?.name ?? "Unknown User",
      imageUrl: skill.user?.imageUrl,
    },
  }));
  const categories = [...new Set(skills.map((skill) => skill.category.name))];
  const tags = [...new Set(skills.flatMap((skill) => skill.tags))];

  return (
    <SkillsClientView
      skills={processedSkills}
      categories={categories}
      availableTags={tags}
    />
  );
}
