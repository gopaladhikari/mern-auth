import { z } from "zod";

export const passwordSchemas = z
  .object({
    oldPassword: z.string().min(1, { message: "Required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TPassowrd = z.infer<typeof passwordSchemas>;
