import { z } from "zod";

export const messageSchema = z.object({
   content: z
      .string()
      .min(4, { message: "Content must be at least of 4 characters" })
      .max(300, { message: "Content must be no more then 300 characters" }),
});
