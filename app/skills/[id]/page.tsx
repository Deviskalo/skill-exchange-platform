import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { BookingRequestForm } from "@/components/skills/booking-request-form";
import { ReportSkillForm } from "@/components/skills/report-skill-form";

export default async function SkillDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [skill, currentUser, reviews] = await Promise.all([
    prisma.skill.findUnique({
      where: { id: params.id },
      include: { category: true, user: true },
    }),
    getSessionUser(),
    prisma.review.findMany({
      where: {
        booking: { skillId: params.id, status: "completed" },
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!skill) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{skill.title}</span>
            {currentUser?.id === skill.userId && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/skills/edit/${skill.id}`}>Edit Skill</Link>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Description</h2>
              <p className="text-muted-foreground">{skill.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Category:</h2>
              <Badge variant="secondary">{skill.category.name}</Badge>
            </div>
            {skill.tags.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="font-semibold">Created By</h2>
              <div className="flex items-center gap-2">
                {skill.user.imageUrl && (
                  <Image
                    src={skill.user.imageUrl}
                    width={40}
                    height={40}
                    alt={skill.user.name || "User"}
                    className="h-10 w-10 rounded-full"
                    unoptimized
                  />
                )}
                <span>{skill.user.name || "Anonymous"}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {skill.createdAt.toLocaleDateString()}
              {skill.createdAt.getTime() !== skill.updatedAt.getTime() && (
                <span className="ml-2">
                  (Last updated: {skill.updatedAt.toLocaleDateString()})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <section className="mt-8 space-y-4" aria-labelledby="reviews-heading">
        <div>
          <h2 id="reviews-heading" className="text-2xl font-semibold">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {(
                reviews.reduce((total, review) => total + review.rating, 0) /
                reviews.length
              ).toFixed(1)}{" "}
              out of 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </p>
          )}
        </div>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">
                    {review.user.name || "SkillSwap learner"}
                  </p>
                  <p
                    className="text-sm"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <p className="text-xs text-muted-foreground">
                  {review.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </section>
      {currentUser?.id === skill.userId ? (
        <p className="mt-6 text-sm text-muted-foreground">
          This is your skill listing. You cannot book a session with yourself.
        </p>
      ) : currentUser ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Request a session</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingRequestForm skillId={skill.id} />
          </CardContent>
        </Card>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link
            href={`/login?returnUrl=${encodeURIComponent(`/skills/${skill.id}`)}`}
            className="font-medium text-primary underline"
          >
            Sign in
          </Link>{" "}
          to request a session.
        </p>
      )}
      {currentUser && currentUser.id !== skill.userId && (
        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="text-base">Safety concern?</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportSkillForm skillId={skill.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
