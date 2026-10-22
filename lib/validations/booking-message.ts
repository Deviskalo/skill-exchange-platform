import { z } from "zod";

export const bookingMessageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});
