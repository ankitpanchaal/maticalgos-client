import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
// const unprotectedRoutes = ["/auth"];

export default async function middleware(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!token && isProtectedRoute) {
    console.log(
      "Redirecting to signin due to lack of session on protected route"
    );
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}