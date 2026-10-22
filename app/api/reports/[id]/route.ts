import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { isModerator } from "@/lib/auth/is-moderator";
import { prisma } from "@/lib/prisma";
import { updateReportSchema } from "@/lib/validations/report-moderation";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user || !isModerator(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report status" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  }).catch((error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
