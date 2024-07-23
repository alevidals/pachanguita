import { BEARER_COOKIE_NAME } from "@/lib/constants";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const bearer = request.cookies.get(BEARER_COOKIE_NAME)?.value;

  // TODO: make a real check
  if (!bearer) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
