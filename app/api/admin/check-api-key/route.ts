import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { withAuth } from "../authMiddleware";

const API_KEY_FILE = path.join(process.cwd(), 'api_key.json');

export const GET = withAuth(async (req: NextRequest) => {
    try {
        if (fs.existsSync(API_KEY_FILE)) {
          const fileContent = fs.readFileSync(API_KEY_FILE, 'utf8');
          const data = JSON.parse(fileContent);
          const isStored = !!data.access_token;
          return NextResponse.json({ isStored });
        } else {
          return NextResponse.json({ isStored: false });
        }
      } catch (error) {
        console.error("Error checking API token:", error);
        return NextResponse.json(
          { message: "An error occurred while checking for the API token" },
          { status: 500 }
        );
      }
});