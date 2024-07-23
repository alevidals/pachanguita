"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq, or } from "drizzle-orm";

type UpdateUserArgs = {
  id: string;
  data: {
    name?: string;
    email?: string;
    password?: string;
    refreshToken?: string;
  };
};

export async function getUser(emailOrId: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.email, emailOrId), eq(usersTable.id, emailOrId)))
    .get();

  return user;
}

export async function updateUser({ id, data }: UpdateUserArgs) {
  const updatedUser = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, id))
    .returning()
    .get();

  return updatedUser;
}
