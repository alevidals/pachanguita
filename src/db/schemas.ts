import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  name: text("name", {
    length: 50,
  }).notNull(),
  email: text("email", {
    length: 50,
  })
    .unique()
    .notNull(),
  password: text("password", {
    length: 50,
  }).notNull(),
  refreshToken: text("refresh_token").unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const paymentsTable = sqliteTable("payments", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  paymentCount: integer("payment_count").notNull(),
});

export const teamsTable = sqliteTable("teams", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  color: text("color"),
});

export const teamUsersTable = sqliteTable("team_users", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  teamId: text("team_id").references(() => teamsTable.id),
  userId: text("user_id").references(() => usersTable.id),
});

export const matchesTable = sqliteTable("matches", {
  id: text("id").default(sql`(uuid())`).primaryKey(),
  teamOneId: text("team_one_id").references(() => teamsTable.id),
  teamTwoId: text("team_two_id").references(() => teamsTable.id),
  matchDate: text("match_date").notNull(),
});
