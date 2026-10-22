import { z } from "zod";

export const createBookingSchema = z.object({
  skillId: z.string().min(1),
  startTime: z.string().datetime({ offset: true }),
  timeZone: z.string().min(1).max(100),
});

export const updateBookingSchema = z.object({
  action: z.enum([
    "confirm",
    "decline",
    "cancel",
    "complete",
    "propose-reschedule",
    "accept-reschedule",
    "decline-reschedule",
  ]),
  proposedStartTime: z.string().datetime({ offset: true }).optional(),
  proposedTimeZone: z.string().min(1).max(100).optional(),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000),
});
