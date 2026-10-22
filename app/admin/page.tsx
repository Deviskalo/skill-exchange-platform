import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/server";
import { isModerator } from "@/lib/auth/is-moderator";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?returnUrl=%2Fadmin");
  }
  if (!isModerator(user.email)) {
    redirect("/dashboard");
  }

  const [openReports, totalReports, totalUsers, totalSkills] =
    await Promise.all([
      prisma.report.count({ where: { status: "open" } }),
      prisma.report.count(),
      prisma.user.count(),
      prisma.skill.count(),
    ]);

  const metrics = [
    { label: "Open reports", value: openReports },
    { label: "All reports", value: totalReports },
    { label: "Members", value: totalUsers },
    { label: "Skill listings", value: totalSkills },
  ];

  return (
    <main className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Review platform activity and handle member safety reports.
          </p>
        </div>
        <Button asChild>
          <Link href="/moderation/reports">Open safety reports</Link>
        </Button>
      </header>

      <section
        aria-label="Platform overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Moderation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Review reported skill listings, read the reporter&apos;s details,
            and record a moderation outcome.
          </p>
          <Button asChild variant="outline">
            <Link href="/moderation/reports">
              View reports{openReports > 0 ? ` (${openReports} open)` : ""}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
