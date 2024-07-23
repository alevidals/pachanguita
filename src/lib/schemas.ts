import { z } from "zod";

// TODO: add real password requirements and messages
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
