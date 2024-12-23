import { NextRequest, NextResponse } from "next/server";
import { withUserAuth } from "../../_utils/userAuth";
import getToken from "../../_utils/getToken";

export const GET = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const acname = (req as any)?.user?.acname;

    if (!acname) {
      return NextResponse.json(
        { error: "Acname query parameter is required" },
        { status: 400 }
      );
    }

    const apiUrl = new URL("/overview/", process.env.APIV_URL);
    apiUrl.searchParams.set('Acname', acname);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching strategies" },
      { status: 500 }
    );
  }
});

//Square off a strategy
export const PATCH = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const url = new URL(req.url);
    const stname = url.searchParams.get("stname");

    if (!stname) {
      return NextResponse.json(
        { error: "stname query parameter is required" },
        { status: 400 }
      );
    }

    const apiUrl = new URL("/SquareOff/strategy/", process.env.APIV_URL);
    apiUrl.searchParams.set('stname', stname);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching strategies" },
      { status: 500 }
    );
  }
});
