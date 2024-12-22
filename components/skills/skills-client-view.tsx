"use client";

import React from "react";
import { SkillCard } from "./skill-card";
import { Skill as PrismaSKill } from "@prisma/client";

interface Skill extends PrismaSKill {
  id: string;
  title: string;
  name: string;
  description: string;
  createdAt: Date;
  category: string;
  tags: string[];
  userId: string;
  updatedAt: Date;
  user: {
    name: string | null;
    imageUrl: string | null;
  };
}

interface SkillsClientViewProps {
  skills: Skill[];
  categories?: string[];
  availableTags?: string[];
}

export const SkillsClientView: React.FC<SkillsClientViewProps> = ({
  skills,
}) => {
  return (
    <div className="skills-client-view">
      <div className="skills-grid">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
};
