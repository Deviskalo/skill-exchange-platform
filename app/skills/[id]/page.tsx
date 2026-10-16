import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { BookingRequestForm } from "@/components/skills/booking-request-form";

export default async function SkillDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [skill, currentUser] = await Promise.all([
    prisma.skill.findUnique({
      where: { id: params.id },
      include: { category: true, user: true },
    }),
    getSessionUser(),
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
    </div>
  );
}
