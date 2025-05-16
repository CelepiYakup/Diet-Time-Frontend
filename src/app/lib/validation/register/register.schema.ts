import { z } from "zod";

const INVALID_DOMAINS = [
  "example.com", "test.com", "invalid.com",
  "fake.com", "demo.com", "placeholder.com",
  "sample.com", "noreply.com", "no-reply.com",
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
      const domain = email.split("@")[1];
      return !INVALID_DOMAINS.includes(domain);
    }, "Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
