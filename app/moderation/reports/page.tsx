import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/server";
import { isModerator } from "@/lib/auth/is-moderator";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportStatusActions } from "@/components/moderation/report-status-actions";

export default async function ReportsModerationPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?returnUrl=%2Fmoderation%2Freports");
  }
  if (!isModerator(user.email)) {
    redirect("/dashboard");
  }

  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { name: true, email: true } },
      targetUser: { select: { name: true, email: true } },
      skill: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold">Safety reports</h1>
        <p className="mt-2 text-muted-foreground">
          Review reports and record the moderation outcome.
        </p>
      </header>
      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          There are no reports to review.
        </p>
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {report.skill?.title || "User report"} · {report.reason}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Reported by {report.reporter.name || report.reporter.email}
                {report.targetUser &&
                  ` · Listing owner: ${report.targetUser.name || report.targetUser.email}`}
                {` · ${report.createdAt.toLocaleString()}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-wrap">
                {report.details || "No additional details provided."}
              </p>
              <ReportStatusActions
                reportId={report.id}
                status={report.status}
              />
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
}
