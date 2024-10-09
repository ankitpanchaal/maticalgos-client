const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const API_KEY_FILE = path.join(process.cwd(), "api_key.json");

async function refreshToken() {
  console.log("Refreshing token...");
  try {
    const fileContent = fs.readFileSync(API_KEY_FILE, "utf8");
    const { api_key } = JSON.parse(fileContent);

    const response = await fetch("https://apiv.maticalgos.com/token/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_secret=${api_key}`,
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      fs.writeFileSync(
        API_KEY_FILE,
        JSON.stringify({ access_token: data.access_token, api_key }, null, 2)
      );
      console.log("Token refreshed successfully");
    } else {
      console.error("Failed to refresh token:", data);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}

function startTokenRefreshCron() {
  cron.schedule("0 9 * * *", refreshToken); // Schedule the job to run every day at 9 AM
  console.log("Token refresh cron job scheduled to run daily at 9 AM");
}

// Start the cron job
startTokenRefreshCron();

// Perform initial token refresh
refreshToken();
