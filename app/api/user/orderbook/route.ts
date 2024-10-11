import { NextRequest, NextResponse } from "next/server";
import { withUserAuth } from "../../_utils/userAuth";
import getToken from "../../_utils/getToken";

export const GET = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const url = new URL(req.url);
    const stname = url.searchParams.get("stname");
    const acname = (req as any)?.user?.acname;

    if (!acname || !stname) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const apiUrl = new URL("/orderbook/", process.env.APIV_URL);
    apiUrl.searchParams.set("acname", acname);
    apiUrl.searchParams.set("stname", stname);

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
    console.error("Error fetching order book:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the order book" },
      { status: 500 }
    );
  }
});
