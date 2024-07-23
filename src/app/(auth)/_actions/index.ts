"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { loginSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/config";
import { BEARER_COOKIE_NAME } from "@/lib/constants";

type FormState = {
  message: string | null;
};

async function getUser(email: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .get();

  return user;
}

export async function loginAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  const { email, password } = parsed.data;

  const user = await getUser(email);

  if (!user) {
    return {
      message: "The user does not exists",
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return {
      message: "The email or the password are not correct",
    };
  }

  const cookieStore = cookies();

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  cookieStore.set(BEARER_COOKIE_NAME, token, {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  redirect("/");
}
