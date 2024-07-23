"use server";

import {
  getCurrentUser,
  getUserByIdOrEmail,
  updateUser,
} from "@/app/(dashboard)/users/_actions";
import { JWT_SECRET } from "@/lib/config";
import { BEARER_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { loginSchema } from "@/lib/schemas";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FormState = {
  message: string | null;
};

type SignArgs = {
  payload: Record<string, string>;
  expirationTime: string | number | Date;
};

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function sign({ payload, expirationTime }: SignArgs) {
  const key = getSecretKey();

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
}

export async function getJwtPayload(bearer: string) {
  try {
    const key = getSecretKey();

    const jwt = await jwtVerify(bearer, key, {
      algorithms: ["HS256"],
    });

    return jwt.payload;
  } catch {
    return undefined;
  }
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

  const user = await getUserByIdOrEmail(email);

  if (!user) {
    return {
      message: "The email or the password are not correct",
    };
  }

  const bcrypt = require("bcrypt");
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

export async function logoutAction() {
  const user = await getCurrentUser();

  if (user) {
    await updateUser({
      id: user?.id,
      data: {
        refreshToken: null,
      },
    });
  }

  const cookieStore = cookies();

  cookieStore.delete(BEARER_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);

  redirect("/login");
}
