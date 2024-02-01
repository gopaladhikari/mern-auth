import { z } from "zod";

export const loginSchemas = z.object({
  email: z.string().min(1, { message: "Required" }).email(),
  password: z.string().min(1, { message: "Required" }),
});
