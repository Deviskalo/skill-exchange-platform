import { z } from "zod";

export const createBookingSchema = z.object({
  skillId: z.string().min(1),
  startTime: z.string().datetime({ offset: true }),
});

export const updateBookingSchema = z.object({
  action: z.enum(["confirm", "decline", "cancel", "complete"]),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000),
});
