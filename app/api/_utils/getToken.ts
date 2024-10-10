import fs from "fs/promises";
import path from "path";

const API_KEY_FILE = path.join(process.cwd(), "api_key.json");

async function getToken() {
  try {
    const data = await fs.readFile(API_KEY_FILE, "utf8");
    const { access_token } = JSON.parse(data);
    return access_token;
  } catch (error) {
    console.error("Error reading API key:", error);
    throw new Error("Failed to read API key");
  }
}

export default getToken;
