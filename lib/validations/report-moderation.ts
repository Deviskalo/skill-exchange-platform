import { z } from "zod";

export const updateReportSchema = z.object({
  status: z.enum(["reviewed", "actioned", "dismissed"]),
});
