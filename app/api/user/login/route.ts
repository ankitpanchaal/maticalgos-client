import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET_KEY = process.env.JWT_SECRET || "secret-x-y-x";

export const GET = async (req: NextRequest) => {
    try {
      const token = req.cookies.get('token');
  
      if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
  
      // Verify the token
      jwt.verify(token.value, SECRET_KEY);
  
      return NextResponse.json({ authenticated: true });
    } catch (error) {
      console.error("Error checking authentication:", error);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  };

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const url = new URL(req.url);
    const acname = url.searchParams.get("Acname");

    if (!acname) {
      return NextResponse.json(
        { error: "Acname query parameter is required" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ acname }, SECRET_KEY, { expiresIn: "1d" });

    // Set JWT token in cookies
    const cookie = serialize("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 24, // 1 day
      path: "/",
    });

    const response = NextResponse.json({
      message: "Token generated and set in cookies",
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching strategies" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    // Clear the token cookie by setting it to an empty string and expiring it
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    const response = NextResponse.json({
      message: "Logged out successfully",
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
};
