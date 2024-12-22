"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import Image from "next/image";

export default function SkillDetailsPage() {
  const params = useParams();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        const skillId = params.id as string;
        const fetchedSkill = await prisma.skill.findUnique({
          where: { id: skillId },
          include: {
            category: true,
            user: true, // Include user details
          },
        });

        if (!fetchedSkill) {
          setError("Skill not found");
          return;
        }

        setSkill(fetchedSkill);
      } catch (err) {
        console.error("Error fetching skill details:", err);
        setError("Failed to load skill details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillDetails();
  }, [params.id]);

  if (loading) {
    return <div>Loading skill details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!skill) {
    return <div>No skill found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{skill.title}</span>
            {currentUser?.uid === skill.userId && (
              <Link href={`/skills/edit/${skill.id}`}>
                <Button variant="outline" size="sm">
                  Edit Skill
                </Button>
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Category:</h3>
              <Badge variant="secondary">{skill.category.name}</Badge>
            </div>

            {skill.tags && skill.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold">Created By</h3>
              <div className="flex items-center space-x-2">
                {skill.user.imageUrl && (
                  <Image
                    src={skill.user.imageUrl}
                    width={40}
                    height={40}
                    alt={skill.user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span>{skill.user.name || "Anonymous"}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Created: {new Date(skill.createdAt).toLocaleDateString()}
              {skill.createdAt !== skill.updatedAt && (
                <span className="ml-2">
                  (Last updated:{" "}
                  {new Date(skill.updatedAt).toLocaleDateString()})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
