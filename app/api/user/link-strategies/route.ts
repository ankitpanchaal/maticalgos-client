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

    const apiUrl = new URL("/link-strategy-account/", process.env.APIV_URL);
    apiUrl.searchParams.set('ac', acname);
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
    console.error("Error fetching linked strategies:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching strategies" },
      { status: 500 }
    );
  }
});
