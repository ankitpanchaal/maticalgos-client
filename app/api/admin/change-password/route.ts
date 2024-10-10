import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { withAuth } from "../authMiddleware";

const CREDENTIALS_FILE = path.join(process.cwd(), 'credentials.json');

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Read current credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

    // Verify current password
    if (currentPassword !== credentials.password) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // Update password
    credentials.password = newPassword;

    // Write updated credentials back to file
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "An error occurred while changing the password" },
      { status: 500 }
    );
  }
});