import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?returnUrl=%2Fdashboard");
  }

  const [skills, bookings] = await Promise.all([
    prisma.skill.findMany({
      where: { userId: user.id },
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { OR: [{ userId: user.id }, { teacherId: user.id }] },
      include: {
        user: { select: { name: true } },
        teacher: { select: { name: true } },
        skill: { select: { title: true } },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="mb-4 h-24 w-24">
              <AvatarImage
                src={user.imageUrl || "/default-avatar.png"}
                alt={user.name || "User profile"}
              />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name || "SkillSwap user"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between">
                <span>Skills Offered</span>
                <Badge variant="secondary">{skills.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Bookings</span>
                <Badge variant="secondary">{bookings.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <p className="text-muted-foreground">
                You haven&apos;t listed any skills yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>{skill.title}</TableCell>
                      <TableCell>{skill.category.name}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/skills/${skill.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Skill Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">You have no bookings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const partner =
                    booking.userId === user.id ? booking.teacher : booking.user;
                  const status = booking.status.toLowerCase();

                  return (
                    <TableRow key={booking.id}>
                      <TableCell>{partner.name || "SkillSwap user"}</TableCell>
                      <TableCell>{booking.skill.title}</TableCell>
                      <TableCell>
                        {booking.startTime.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "confirmed"
                              ? "default"
                              : status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/skills">Find a Skill to Learn</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/skills/create">Offer a Skill</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profile">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
