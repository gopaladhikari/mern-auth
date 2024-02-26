import { z } from "zod";

export const registerSchemas = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().min(1, { message: "Required" }).email(),
  password: z.string().min(1, { message: "Required" }),
  avatar: z
    .any()
    .refine((file) => file?.length !== 0, { message: "File is required" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters" })
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Invalid phone number" }),
});
