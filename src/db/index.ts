import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "@/lib/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
