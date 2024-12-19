import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, ChefHat, Palette, Users, Globe, Star, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { auth } from "@/lib/firebase";

export default async function Home() {
  // Get the current authenticated user from Firebase
  const firebaseUser = auth.currentUser;

  // If Firebase user exists but not in Prisma, create a user
  if (firebaseUser) {
    const existingUser = await prisma.user.findUnique({
      where: { email: firebaseUser.email || undefined }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          imageUrl: firebaseUser.photoURL || '/default-avatar.png'
        }
      });
    }
  }

  // Fetch recent skills and top contributors
  const recentSkills = await prisma.skill.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true
        }
      }
    }
  });

  const topContributors = await prisma.user.findMany({
    take: 4,
    orderBy: { skills: { _count: 'desc' } },
    select: {
      name: true,
      imageUrl: true,
      _count: {
        select: { skills: true }
      }
    }
  });


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-secondary">
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Share Knowledge, Learn Together
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Exchange skills with people around the world. Teach what you know,
            learn what you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/skills">Find Skills</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/teach">Start Teaching</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/skills?category=${category.name.toLowerCase()}`}
                className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  {category.icon}
                  <h3 className="mt-4 text-xl font-semibold">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <Rocket className="w-8 h-8 text-primary" />
                  Create Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sign up and showcase your skills, interests, and learning goals.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <Globe className="w-8 h-8 text-primary" />
                  Explore Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Browse through a diverse range of skills from people around the world.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-primary" />
                  Connect & Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect with skill providers, schedule sessions, and start learning!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Skills */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recently Added Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{skill.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Image 
                      src={skill.user.imageUrl || '/default-avatar.png'} 
                      alt={skill.user.name || 'Unknown User'}
                      width={32}
                      height={32} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{skill.user.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/skills">View All Skills</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Top Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topContributors.map((contributor) => (
              <Card key={contributor.name} className="hover:shadow-lg transition-all">
                <CardHeader className="flex flex-col items-center">
                  <Image 
                    src={contributor.imageUrl || '/default-avatar.png'} 
                    alt={contributor.name || 'Unknown User'}
                    width={96}
                    height={96} 
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <CardTitle className="text-center">{contributor.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {contributor._count.skills} skills shared
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: "Programming",
    icon: <Code className="w-12 h-12 text-primary" />,
    description: "Learn coding, web development, and software engineering",
  },
  {
    name: "Cooking",
    icon: <ChefHat className="w-12 h-12 text-primary" />,
    description: "Master culinary arts and cooking techniques",
  },
  {
    name: "Languages",
    icon: <BookOpen className="w-12 h-12 text-primary" />,
    description: "Learn new languages from native speakers",
  },
  {
    name: "Arts",
    icon: <Palette className="w-12 h-12 text-primary" />,
    description: "Explore drawing, painting, and digital art",
  },
];

const steps = [
  {
    title: "Create Your Profile",
    description:
      "Sign up and list the skills you want to teach or learn from others.",
  },
  {
    title: "Connect with Others",
    description:
      "Find people with the skills you want to learn or those who want to learn from you.",
  },
  {
    title: "Start Learning",
    description:
      "Book sessions, exchange knowledge, and grow together with our community.",
  },
];