import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validations/booking";

type RouteContext = {
  params: { id: string };
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review details" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      userId: true,
      status: true,
      endTime: true,
      review: { select: { id: true } },
    },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== user.id) {
    return NextResponse.json(
      { error: "Only the learner can review this session" },
      { status: 403 }
    );
  }
  if (booking.status !== "completed" || booking.endTime > new Date()) {
    return NextResponse.json(
      { error: "Only completed sessions can be reviewed" },
      { status: 409 }
    );
  }
  if (booking.review) {
    return NextResponse.json(
      { error: "This session already has a review" },
      { status: 409 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        ...parsed.data,
        bookingId: booking.id,
        userId: user.id,
      },
      select: { id: true },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This session already has a review" },
        { status: 409 }
      );
    }
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Unable to save your review" },
      { status: 500 }
    );
  }
}
