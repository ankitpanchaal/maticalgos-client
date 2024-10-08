import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    try {
      // Verify the token
      const decoded = verify(token, process.env.JWT_SECRET!);

      return NextResponse.json({ valid: true });
    } catch (error) {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 500 }
    );
  }
}
