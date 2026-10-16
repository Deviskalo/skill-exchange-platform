import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { updateBookingSchema } from "@/lib/validations/booking";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking action" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      userId: true,
      teacherId: true,
      skillId: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { action } = parsed.data;
  const isTeacher = booking.teacherId === user.id;
  const isLearner = booking.userId === user.id;
  if (!isTeacher && !isLearner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return NextResponse.json(
      { error: "This booking can no longer be changed" },
      { status: 409 }
    );
  }
  if ((action === "confirm" || action === "decline") && !isTeacher) {
    return NextResponse.json(
      { error: "Only the teacher can respond to a booking request" },
      { status: 403 }
    );
  }
  if (action === "complete" && !isTeacher) {
    return NextResponse.json(
      { error: "Only the teacher can mark a session as completed" },
      { status: 403 }
    );
  }
  if (action === "confirm" && booking.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending requests can be confirmed" },
      { status: 409 }
    );
  }
  if (action === "decline" && booking.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending requests can be declined" },
      { status: 409 }
    );
  }
  if (action === "complete" && booking.status !== "confirmed") {
    return NextResponse.json(
      { error: "Only confirmed sessions can be completed" },
      { status: 409 }
    );
  }
  if (action === "complete" && booking.endTime > new Date()) {
    return NextResponse.json(
      { error: "A session can only be completed after its scheduled end time" },
      { status: 409 }
    );
  }
  if (action === "cancel" && booking.status === "confirmed" && booking.startTime <= new Date()) {
    return NextResponse.json(
      { error: "A session that has already started cannot be cancelled" },
      { status: 409 }
    );
  }

  if (action === "confirm") {
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        id: { not: booking.id },
        teacherId: booking.teacherId,
        status: "confirmed",
        startTime: { lt: booking.endTime },
        endTime: { gt: booking.startTime },
      },
      select: { id: true },
    });
    if (conflictingBooking) {
      return NextResponse.json(
        { error: "The teacher already has a confirmed session at that time" },
        { status: 409 }
      );
    }
  }

  const status =
    action === "confirm"
      ? "confirmed"
      : action === "decline"
        ? "declined"
        : action === "complete"
          ? "completed"
          : "cancelled";
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status },
  });

  return NextResponse.json({ success: true, status });
}
