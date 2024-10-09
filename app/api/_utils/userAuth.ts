import { NextRequest, NextResponse } from "next/server";

export function withUserAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {

    // if (!token) {
    //   return NextResponse.json({ message: "Missing token" }, { status: 401 });
    // }

    try {
    //   const decoded = verify(token, process.env.JWT_SECRET!);
    //   // Add the decoded token to the request object
    //   (req as any).user = decoded;
      return handler(req);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  };
}