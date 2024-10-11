import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    
    const isProtectedRoute = protectedRoutes.some((prefix) =>
        request.nextUrl.pathname.startsWith(prefix)
    );

    // If it's not a protected route, allow the request to proceed
    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // For protected routes, check for a valid token
    if (!token?.value) {
        console.log("Redirecting to signin due to lack of token on protected route");
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
        if (!payload?.acname) {
            throw new Error("Invalid token payload");
        }
    } catch (error) {
        console.error("JWT verification failed", error);
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If we reach here, the token is valid for a protected route
    return NextResponse.next();
}

