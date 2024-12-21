import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillCard } from "@/components/skills/skill-card";
import { CategoryHeader } from "@/components/categories/category-header";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        equals: params.slug,
        mode: "insensitive",
      },
    },
    include: {
      skills: {
        include: {
          user: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const processedSkills = category.skills.map(skill => ({
    ...skill, 
    user: {
      name: skill.user.name || 'Unknown User', 
      imageUrl: skill.user.imageUrl
    }
  }));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <CategoryHeader category={category} />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
