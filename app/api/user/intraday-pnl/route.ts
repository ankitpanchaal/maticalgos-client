import { NextRequest, NextResponse } from "next/server";
import { withUserAuth } from "../../_utils/userAuth";
import getToken from "../../_utils/getToken";

export const GET = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const acname = (req as any)?.user?.acname;
    const url = new URL(req.url);
    const stname = url.searchParams.get("stname");

    if (!stname || !acname) {
      return NextResponse.json(
        { error: "stname query parameter is required" },
        { status: 400 }
      );
    }

    let response = await fetch(
      process.env.APIV_URL +
        "/intradaypnl?stname=" +
        stname +
        "&acname=" +
        acname,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("response : ", response.status);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error linking strategy:", error);
    return NextResponse.json(
      { error: "An error occurred while linking strategy" },
      { status: 500 }
    );
  }
});
