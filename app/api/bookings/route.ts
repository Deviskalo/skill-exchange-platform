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
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: parsed.data.timeZone });
  } catch {
    return NextResponse.json({ error: "Invalid time zone" }, { status: 400 });
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

  const dailyRequestCount = await prisma.booking.count({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  if (dailyRequestCount >= 5) {
    return NextResponse.json(
      { error: "You have reached the limit of five booking requests per day" },
      { status: 429 }
    );
  }

  const existingRequest = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      skillId: skill.id,
      status: { in: ["pending", "confirmed"] },
    },
    select: { id: true },
  });
  if (existingRequest) {
    return NextResponse.json(
      { error: "You already have an active booking for this skill" },
      { status: 409 }
    );
  }

  const endTime = new Date(startTime.getTime() + SESSION_DURATION_MS);
  const scheduleConflict = await prisma.booking.findFirst({
    where: {
      teacherId: skill.userId,
      status: "confirmed",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
    select: { id: true },
  });
  if (scheduleConflict) {
    return NextResponse.json(
      { error: "The teacher is already booked at that time" },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      teacherId: skill.userId,
      skillId: skill.id,
      startTime,
      endTime,
      timeZone: parsed.data.timeZone,
    },
    select: { id: true },
  });

  return NextResponse.json(booking, { status: 201 });
}
