import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "@/components/bookings/review-form";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

type ReviewPageProps = {
  params: { id: string };
};

export default async function BookingReviewPage({ params }: ReviewPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/bookings/${params.id}/review`)}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      skill: { select: { title: true } },
      teacher: { select: { name: true } },
      review: { select: { id: true } },
    },
  });
  if (!booking || booking.userId !== user.id) {
    notFound();
  }
  if (
    booking.status !== "completed" ||
    booking.endTime > new Date() ||
    booking.review
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Review your session</CardTitle>
          <p className="text-sm text-muted-foreground">
            {booking.skill.title} with {booking.teacher.name || "your teacher"}
          </p>
        </CardHeader>
        <CardContent>
          <ReviewForm bookingId={booking.id} />
        </CardContent>
      </Card>
    </div>
  );
}
