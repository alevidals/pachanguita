import type { loginSchema } from "@/lib/schemas";
import type { z } from "zod";

export type Login = z.infer<typeof loginSchema>;
