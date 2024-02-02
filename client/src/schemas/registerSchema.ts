import { z } from "zod";

export const registerSchemas = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().min(1, { message: "Required" }).email(),
  password: z.string().min(1, { message: "Required" }),
  avatar: z
    .any()
    .refine((file) => file?.length !== 0, { message: "File is required" }),
});
