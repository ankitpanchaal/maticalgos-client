import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      // Add the decoded token to the request object
      (req as any).user = decoded;
      return handler(req);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}