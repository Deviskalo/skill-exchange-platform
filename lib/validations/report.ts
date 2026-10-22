import { z } from "zod";

export const reportSchema = z.object({
  skillId: z.string().min(1),
  reason: z.enum(["spam", "misleading", "harassment", "other"]),
  details: z.string().trim().max(500).optional(),
});
