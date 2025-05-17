import { z } from "zod";

const ALLOWED_DOMAINS = [
  "gmail.com", "hotmail.com", "yandex.com",
  "icloud.com", "yahoo.com","outlook.com"
];

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      return ALLOWED_DOMAINS.includes(domain);
    }, "Only gmail.com, hotmail.com, yandex.com, icloud.com, or yahoo.com emails are allowed"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
