import { z } from "zod";

export const skillSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(2000),
  categoryId: z.string().min(1),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export type SkillInput = z.infer<typeof skillSchema>;
