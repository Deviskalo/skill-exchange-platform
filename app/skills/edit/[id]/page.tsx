"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { getAuth } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Zod schema for skill validation
const skillSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).optional(),
});

export default function EditSkillPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [skill, setSkill] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      tags: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedSkill] = await Promise.all([
          prisma.category.findMany(),
          prisma.skill.findUnique({
            where: { id: params.id as string },
          }),
        ]);

        setCategories(fetchedCategories);

        if (!fetchedSkill) {
          toast({
            variant: "destructive",
            title: "Skill Not Found",
            description: "The skill you are trying to edit does not exist",
          });
          router.push("/skills");
          return;
        }

        // Check if current user is the skill owner
        if (fetchedSkill.userId !== currentUser?.uid) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You are not authorized to edit this skill",
          });
          router.push("/skills");
          return;
        }

        setSkill(fetchedSkill);
        setTags(fetchedSkill.tags || []);

        form.reset({
          title: fetchedSkill.title,
          description: fetchedSkill.description,
          categoryId: fetchedSkill.categoryId,
          tags: fetchedSkill.tags,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch skill data",
        });
        router.push("/skills");
      }
    };

    fetchData();
  }, [params.id, currentUser, router, form, toast]);

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: z.infer<typeof skillSchema>) => {
    if (!currentUser || !skill) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in and ensure you are the skill owner",
      });
      return;
    }

    try {
      const updatedSkill = await prisma.skill.update({
        where: { id: skill.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      toast({
        title: "Skill Updated",
        description: "Your skill has been successfully updated",
      });

      router.push(`/skills/${updatedSkill.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update skill",
      });
    }
  };

  if (!skill) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Skill</h1>

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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            <FormLabel>Tags (Optional)</FormLabel>
            <div className="flex space-x-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="ml-1 h-4 w-4"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Update Skill
          </Button>
        </form>
      </Form>
    </div>
  );
}
