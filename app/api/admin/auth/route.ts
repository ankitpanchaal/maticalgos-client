import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { authProtection } from "../../_utils/authProtection";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const ip = req.ip || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    // Apply rate limiting and account lockout protection
    const protectionError = await authProtection.checkAttempts(ip, username, userAgent);
    if (protectionError) {
      return NextResponse.json({ error: protectionError }, { status: 429 });
    }
    
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a JWT token
      const token = sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
