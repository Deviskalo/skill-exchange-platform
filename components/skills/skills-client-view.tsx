"use client";

import React from 'react';
import { SkillCard } from './skill-card';

interface Skill {
    id: string;
    title: string;  // Added
    name: string;
    description: string;
    createdAt: Date;  // Added
    category: string;  // Added
    tags: string[];  // Added
    userId: string;  // Added
    updatedAt: Date;  // Added
    user: {
      name: string;
      imageUrl: string | null;  // Changed to allow null
    };
  }

interface SkillsClientViewProps {
  skills: Skill[];
  categories?: string[];
  availableTags?: string[];
}

export const SkillsClientView: React.FC<SkillsClientViewProps> = ({ skills }) => {
  return (
    <div className="skills-client-view">
      <div className="skills-grid">
        {skills.map((skill) => (
          <SkillCard 
            key={skill.id}
            skill={skill}
          />
        ))}
      </div>
    </div>
  );
};