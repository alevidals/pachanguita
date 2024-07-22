import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "@/lib/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas.ts",
  driver: "turso",
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  dialect: "sqlite",
  out: "./src/db/migrations",
} satisfies Config;
