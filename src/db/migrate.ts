import "dotenv/config";
import { db } from "@/db";
import { migrate } from "drizzle-orm/libsql/migrator";

migrate(db, { migrationsFolder: "./src/db/migrations" });
