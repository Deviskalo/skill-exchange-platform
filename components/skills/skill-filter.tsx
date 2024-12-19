"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface SkillFilterProps {
  onFilter: (filters: { search: string; categories: string[]; tags: string[] }) => void;
  categories: string[];
  availableTags: string[];
}

export function SkillFilter({ onFilter, categories, availableTags }: SkillFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleFilter = () => {
    onFilter({
      search,
      categories: selectedCategories,
      tags: selectedTags,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleFilter}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                );
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                );
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedCategories([]);
            setSelectedTags([]);
            onFilter({ search, categories: [], tags: [] });
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}