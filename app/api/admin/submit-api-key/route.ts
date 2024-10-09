import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { withAuth } from "../authMiddleware";

const API_KEY_FILE = path.join(process.cwd(), "api_key.json");

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { apiKey } = await req.json();

    const response = await fetch(process.env.APIV_URL + "/token/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_secret=${apiKey}`,
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      fs.writeFileSync(
        API_KEY_FILE,
        JSON.stringify(
          { access_token: data.access_token, api_key: apiKey },
          null,
          2
        )
      );

      return NextResponse.json({ message: "API key stored successfully" });
    } else {
      return NextResponse.json({ message: "Invalid API key" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error submitting API key:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting the API key" },
      { status: 500 }
    );
  }
});
