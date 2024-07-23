import { BEARER_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { getJwtPayload, sign } from "@/services/auth";
import { getUser } from "@/services/users";

import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(BEARER_COOKIE_NAME)?.value;

  if (accessToken) {
    const acessTokenPayload = await getJwtPayload(accessToken);

    if (acessTokenPayload) {
      return NextResponse.next();
    }
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const refreshTokenPayload = await getJwtPayload(refreshToken);

  if (!refreshTokenPayload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { email } = refreshTokenPayload;

  const user = await getUser(String(email));

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user.refreshToken === refreshToken) {
    const response = NextResponse.next();

    const accessToken = await sign({
      payload: {
        id: user.id,
        email: user.email,
      },
      expirationTime: "1 hour from now",
    });

    response.cookies.set({
      name: BEARER_COOKIE_NAME,
      value: accessToken,
      path: "/",
      maxAge: 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(BEARER_COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE_NAME);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
