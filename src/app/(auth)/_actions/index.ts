"use server";

import { BEARER_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { loginSchema } from "@/lib/schemas";
import { sign } from "@/services/auth";
import { getUser, updateUser } from "@/services/users";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FormState = {
  message: string | null;
};

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
      message: "The email or the password are not correct",
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return {
      message: "The email or the password are not correct",
    };
  }

  const cookieStore = cookies();

  const accessToken = await sign({
    payload: {
      id: user.id,
      email: user.email,
    },
    expirationTime: "1 hour from now",
  });

  const refreshToken = await sign({
    payload: {
      email: user.email,
    },
    expirationTime: "1 week from now",
  });

  await updateUser({
    id: user.id,
    data: {
      refreshToken,
    },
  });

  cookieStore.set(BEARER_COOKIE_NAME, accessToken, {
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    path: "/",
    maxAge: 604800,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  redirect("/");
}
