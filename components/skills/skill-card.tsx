"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skill } from "@prisma/client";

interface SkillCardProps {
  skill: Skill & {
    user: {
      name: string;
      imageUrl: string | null;
    };
  };
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={skill.user.imageUrl || undefined} />
            <AvatarFallback>{skill.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{skill.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{skill.user.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/skills/${skill.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}