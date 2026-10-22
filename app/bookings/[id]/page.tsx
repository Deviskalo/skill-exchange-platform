import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookingConversation } from "@/components/bookings/booking-conversation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

type BookingPageProps = {
  params: { id: string };
};

export default async function BookingPage({ params }: BookingPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/bookings/${params.id}`)}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      skill: { select: { title: true } },
      messages: {
        include: { sender: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
        take: 200,
      },
    },
  });
  if (!booking || (booking.userId !== user.id && booking.teacherId !== user.id)) {
    notFound();
  }

  const partner =
    booking.userId === user.id ? booking.teacher.name : booking.user.name;
  const canMessage = ["pending", "confirmed", "completed"].includes(
    booking.status
  );

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-primary underline">
          Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Session conversation</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{booking.skill.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            With {partner || "SkillSwap user"} ·{" "}
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: booking.timeZone || "UTC",
            }).format(booking.startTime)}{" "}
            ({booking.timeZone || "UTC"}) · {booking.status}
          </p>
        </CardHeader>
        <CardContent>
          <BookingConversation
            bookingId={booking.id}
            currentUserId={user.id}
            canMessage={canMessage}
            initialMessages={booking.messages.map((message) => ({
              id: message.id,
              body: message.body,
              createdAt: message.createdAt.toISOString(),
              senderId: message.senderId,
              senderName: message.sender.name || "SkillSwap user",
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
