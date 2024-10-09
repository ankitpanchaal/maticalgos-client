import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../authMiddleware";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { apiKey } = await req.json();

    const response = await fetch(process.env.APIV_URL + '/token/', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_secret=${apiKey}`,
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      return NextResponse.json({ valid: true, message: "API key is valid" });
    } else {
      return NextResponse.json({ valid: false, message: "Invalid API key" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error testing API key:", error);
    return NextResponse.json(
      { message: "An error occurred while testing the API key" },
      { status: 500 }
    );
  }
});