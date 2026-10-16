import { z } from "zod";

export const createBookingSchema = z.object({
  skillId: z.string().min(1),
  startTime: z.string().datetime({ offset: true }),
});

export const updateBookingSchema = z.object({
  action: z.enum(["confirm", "decline", "cancel"]),
});
