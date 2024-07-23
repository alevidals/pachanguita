"use server";

import { JWT_SECRET } from "@/lib/config";
import { SignJWT, jwtVerify } from "jose";

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
