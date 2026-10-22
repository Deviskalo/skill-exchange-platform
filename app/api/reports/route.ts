import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/lib/validations/report";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to report a listing" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report details" }, { status: 400 });
  }

  const skill = await prisma.skill.findUnique({
    where: { id: parsed.data.skillId },
    select: { id: true, userId: true },
  });
  if (!skill) {
    return NextResponse.json({ error: "Skill listing not found" }, { status: 404 });
  }
  if (skill.userId === user.id) {
    return NextResponse.json(
      { error: "You cannot report your own listing" },
      { status: 400 }
    );
  }

  const recentReportCount = await prisma.report.count({
    where: {
      reporterId: user.id,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  if (recentReportCount >= 3) {
    return NextResponse.json(
      { error: "You have reached the limit of three reports per day" },
      { status: 429 }
    );
  }

  const duplicateReport = await prisma.report.findFirst({
    where: {
      reporterId: user.id,
      skillId: skill.id,
      status: "open",
    },
    select: { id: true },
  });
  if (duplicateReport) {
    return NextResponse.json(
      { error: "You have already reported this listing" },
      { status: 409 }
    );
  }

  await prisma.report.create({
    data: {
      reporterId: user.id,
      targetUserId: skill.userId,
      skillId: skill.id,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
    },
  });

  return NextResponse.json(
    { message: "Thank you. Your report has been submitted for review." },
    { status: 201 }
  );
}
