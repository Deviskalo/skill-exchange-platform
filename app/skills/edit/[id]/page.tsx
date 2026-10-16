import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/server";
import { SkillForm } from "@/components/skills/skill-form";

export default async function EditSkillPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/skills/edit/${params.id}`)}`);
  }

  const [skill, categories] = await Promise.all([
    prisma.skill.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!skill) {
    notFound();
  }
  if (skill.userId !== user.id) {
    redirect("/skills");
  }

  return (
    <SkillForm
      categories={categories}
      skill={{
        id: skill.id,
        title: skill.title,
        description: skill.description,
        categoryId: skill.categoryId,
        tags: skill.tags,
      }}
    />
  );
}
