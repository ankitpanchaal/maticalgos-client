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
    apiUrl.searchParams.set("ac", acname);
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

export const POST = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const acname = (req as any)?.user?.acname;
    const { StrategyID, StrategyName, type } = await req.json();

    if (!acname) {
      return NextResponse.json(
        { error: "Acname query parameter is required" },
        { status: 400 }
      );
    }
    if (!StrategyID || !StrategyName) {
      return NextResponse.json(
        { error: "StrategyID and StrategyName are required" },
        { status: 400 }
      );
    }

    const body = {
      StrategyName: StrategyName,
      AccountName: acname,
      Multiplier: 1,
      Activate: 0,
      Capital: 0,
    };
    let response;
    if (type === "subscribe") {
      response = await fetch(process.env.APIV_URL + "/linkstrategy", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } else {
      response = await fetch(
        process.env.APIV_URL +
          "/linkstrategy?st=" +
          StrategyName +
          "&ac=" +
          acname,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

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

//update status of strategy
export const PUT = withUserAuth(async (req: NextRequest) => {
  try {
    const token = await getToken();
    const acname = (req as any)?.user?.acname;
    const { StrategyID, StrategyName, Activate } = await req.json();

    if (!acname) {
      return NextResponse.json(
        { message: "Acname query parameter is required" },
        { status: 400 }
      );
    }
    if (!StrategyID || !StrategyName) {
      return NextResponse.json(
        { message: "StrategyID and StrategyName are required" },
        { status: 400 }
      );
    }

    const body = {
        "Multiplier": 1,
        Activate,
        "Capital": 0
    };

    let response = await fetch(
        process.env.APIV_URL +
          "/linkstrategy?st=" +
          StrategyName +
          "&ac=" +
          acname,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
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
