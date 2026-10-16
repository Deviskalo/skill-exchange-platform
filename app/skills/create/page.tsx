import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/server";
import { SkillForm } from "@/components/skills/skill-form";

export default async function CreateSkillPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?returnUrl=%2Fskills%2Fcreate");
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <SkillForm categories={categories} />;
}
