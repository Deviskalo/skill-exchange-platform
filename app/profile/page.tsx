import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?returnUrl=%2Fprofile");
  }

  const skills = await prisma.skill.findMany({
    where: { userId: user.id },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ProfileClient
      profile={{
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      }}
      skills={skills}
    />
  );
}
