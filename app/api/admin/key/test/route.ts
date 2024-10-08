import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../../authMiddleware";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    return NextResponse.json({ message: "Protected route" });
  } catch (error) {
    console.error("Error during protected route:", error);
    return NextResponse.json(
      { error: "An error occurred during protected route" },
      { status: 500 }
    );
  }
});
