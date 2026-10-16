"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const skillSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()),
});

type SkillFormValues = z.infer<typeof skillSchema>;
type SkillFormProps = {
  categories: { id: string; name: string }[];
  skill?: SkillFormValues & { id: string };
};

export function SkillForm({ categories, skill }: SkillFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill
      ? {
          title: skill.title,
          description: skill.description,
          categoryId: skill.categoryId,
          tags: skill.tags,
        }
      : { title: "", description: "", categoryId: "", tags: [] },
  });
  const tags = form.watch("tags");

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      form.setValue("tags", [...tags, tag], { shouldDirty: true });
    }
    setTagInput("");
  };

  const onSubmit = async (data: SkillFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        skill ? `/api/skills/${skill.id}` : "/api/skills",
        {
          method: skill ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not save skill");
      }

      toast({
        title: "Success",
        description: skill
          ? "Your skill has been updated"
          : "Your skill has been created",
      });
      router.push(`/skills/${result.id}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Could not save skill",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {skill ? "Edit Skill" : "Create a New Skill"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter skill title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your skill in detail"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel htmlFor="skill-tag">Tags (Optional)</FormLabel>
            <div className="mb-2 flex gap-2">
              <Input
                id="skill-tag"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag"
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.setValue(
                      "tags",
                      tags.filter((currentTag) => currentTag !== tag),
                      { shouldDirty: true }
                    )
                  }
                >
                  {tag} ×
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : skill
                ? "Update Skill"
                : "Create Skill"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
