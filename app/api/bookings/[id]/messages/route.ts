import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { bookingMessageSchema } from "@/lib/validations/booking-message";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: { userId: true, teacherId: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== user.id && booking.teacherId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.bookingMessage.findMany({
    where: { bookingId: params.id },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });
  return NextResponse.json(
    messages.map((message) => ({
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderName: message.sender.name || "SkillSwap user",
    }))
  );
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Message must be 1–2000 characters" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: { userId: true, teacherId: true, status: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== user.id && booking.teacherId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["pending", "confirmed", "completed"].includes(booking.status)) {
    return NextResponse.json(
      { error: "Messaging is unavailable for this booking" },
      { status: 409 }
    );
  }

  const recentMessageCount = await prisma.bookingMessage.count({
    where: {
      bookingId: params.id,
      senderId: user.id,
      createdAt: { gte: new Date(Date.now() - 60_000) },
    },
  });
  if (recentMessageCount >= 5) {
    return NextResponse.json(
      { error: "Please wait a minute before sending more messages" },
      { status: 429 }
    );
  }

  const message = await prisma.bookingMessage.create({
    data: {
      bookingId: params.id,
      senderId: user.id,
      body: parsed.data.body,
    },
    include: { sender: { select: { name: true } } },
  });
  return NextResponse.json(
    {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      senderId: message.senderId,
      senderName: message.sender.name || "SkillSwap user",
    },
    { status: 201 }
  );
}
