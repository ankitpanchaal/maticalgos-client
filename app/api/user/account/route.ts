import { NextRequest, NextResponse } from "next/server";
import { withUserAuth } from "../../_utils/userAuth";
import getToken from "../../_utils/getToken";

export const GET = withUserAuth(async (req: NextRequest) => {
  try {
    const acname = (req as any)?.user?.acname;
    const token = await getToken();

    if (!acname) {
      return NextResponse.json(
        { error: "Acname query parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.APIV_URL + "/account/" + acname, {
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
    console.log("Error fetching account:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching account" },
      { status: 500 }
    );
  }
});

export const PUT = withUserAuth(async (req: NextRequest) => {
  try {
    const acname = (req as any)?.user?.acname;
    const token = await getToken();
    const url = new URL(req.url);
    const tradeStatus = url.searchParams.get("tradeStatus");

    console.log("tradeStatus : ", tradeStatus);

    if (!acname) {
      return NextResponse.json(
        { error: "Acname query parameter is required" },
        { status: 400 }
      );
    }
    if (!tradeStatus) {
      return NextResponse.json(
        { error: "Trade status is required" },
        { status: 400 }
      );
    }

    // const response = await fetch(process.env.APIV_URL + "/account/" + acname, {
    const response = await fetch(
      `${process.env.APIV_URL}/activate-account/${acname}/${tradeStatus}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("Error updating trade status:", error);
    return NextResponse.json(
      { error: "An error occurred while updating trade status" },
      { status: 500 }
    );
  }
});
