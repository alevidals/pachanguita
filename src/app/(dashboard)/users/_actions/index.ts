"use server";

import { getJwtPayload } from "@/app/(auth)/_actions";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { BEARER_COOKIE_NAME } from "@/lib/constants";
import { eq, or } from "drizzle-orm";
import { cookies } from "next/headers";

type UpdateUserArgs = {
  id: string;
  data: {
    name?: string;
    email?: string;
    password?: string;
    refreshToken?: string | null;
  };
};

export async function getCurrentUser() {
  const cookieStore = cookies();

  const accessToken = cookieStore.get(BEARER_COOKIE_NAME)?.value;

  if (!accessToken) return;

  const payload = await getJwtPayload(accessToken);

  if (!payload) return;

  const { id } = payload;

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, String(id)))
    .get();

  return user;
}

export async function getUserByIdOrEmail(emailOrId: string) {
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
