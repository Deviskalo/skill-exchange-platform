import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations/booking";

const SESSION_DURATION_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
  }

  const startTime = new Date(parsed.data.startTime);
  if (startTime.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Choose a start time in the future" },
      { status: 400 }
    );
  }

  const skill = await prisma.skill.findUnique({
    where: { id: parsed.data.skillId },
    select: { id: true, userId: true },
  });
  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }
  if (skill.userId === user.id) {
    return NextResponse.json(
      { error: "You cannot book your own skill" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      teacherId: skill.userId,
      skillId: skill.id,
      startTime,
      endTime: new Date(startTime.getTime() + SESSION_DURATION_MS),
    },
    select: { id: true },
  });

  return NextResponse.json(booking, { status: 201 });
}
