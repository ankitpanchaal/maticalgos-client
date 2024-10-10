import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { API_ENDPOINT } from "@/lib/constants/app-constants";

export function withUserAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.cookies.get('token');

    if (!token?.value) {
      console.log("No token found, redirecting to auth");
      return NextResponse.redirect(API_ENDPOINT as string);
    }

    try {
      const decoded = verify(token?.value.toString(), process.env.JWT_SECRET!);
      (req as any).user = decoded;
      // acname = req.user.acname;
      return handler(req);
    } catch (error) {
      console.log("Invalid token, redirecting to auth");
      return NextResponse.redirect(API_ENDPOINT as string);
    }
  };
}