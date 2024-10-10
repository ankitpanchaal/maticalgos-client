import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { authProtection } from "../../_utils/authProtection";
import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = path.join(process.cwd(), 'credentials.json');

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const ip = req.ip || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    // Apply rate limiting and account lockout protection
    const protectionError = await authProtection.checkAttempts(ip, username, userAgent);
    if (protectionError) {
      return NextResponse.json({ message: protectionError }, { status: 429 });
    }
    
    // Read credentials from JSON file
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

    if (
      username === credentials.username &&
      password === credentials.password
    ) {
      // Generate a JWT token
      const token = sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}