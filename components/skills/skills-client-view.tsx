"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkillCard } from "./skill-card";
import type { Skill as PrismaSkill } from "@prisma/client";

interface Skill extends PrismaSkill {
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
  categories = [],
  availableTags = [],
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const filteredSkills = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return skills.filter((skill) => {
      const matchesSearch =
        !query ||
        [
          skill.title,
          skill.description,
          skill.name,
          skill.category,
          ...skill.tags,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query);
      const matchesCategory = !category || skill.category === category;
      const matchesTags = selectedTags.every((tag) => skill.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [skills, search, category, selectedTags]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Browse skills</h1>
        <p className="text-muted-foreground">
          Find someone to learn from, or discover a skill to share.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <label htmlFor="skill-search" className="mb-2 block text-sm font-medium">
            Search skills
          </label>
          <Input
            id="skill-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, descriptions, teachers, or tags"
          />
        </div>
        <div>
          <label htmlFor="skill-category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="skill-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Filter by tags</h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  aria-pressed={selected}
                  onClick={() =>
                    setSelectedTags((current) =>
                      selected
                        ? current.filter((value) => value !== tag)
                        : [...current, tag]
                    )
                  }
                >
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filteredSkills.length}{" "}
          {filteredSkills.length === 1 ? "skill" : "skills"} found
        </p>
        {(search || category || selectedTags.length > 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategory("");
              setSelectedTags([]);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="font-semibold">No matching skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or clear your filters.
          </p>
        </div>
      )}
    </div>
  );
};
