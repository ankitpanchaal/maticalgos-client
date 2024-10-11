import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { API_ENDPOINT } from "./lib/constants/app-constants";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
    const cookieStore = cookies();
    const _token = cookieStore.get("token");
    
    const isProtectedRoute = protectedRoutes.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix)
  );
  
  if (!_token && isProtectedRoute) {
    console.log(
      "Redirecting to signin due to lack of session on protected route"
    );
    const absoluteURL = new URL(API_ENDPOINT as string);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if(!_token?.value) return NextResponse.redirect(API_ENDPOINT as string);

  try {
    const { payload } = await jwtVerify(_token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
    if(!payload?.acname) return NextResponse.redirect(API_ENDPOINT as string);
  } catch (error) {
    console.error("JWT verification failed", error);
    return NextResponse.redirect(API_ENDPOINT as string);
  }

  return NextResponse.next();
}