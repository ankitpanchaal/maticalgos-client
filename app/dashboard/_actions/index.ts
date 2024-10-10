import { API_ENDPOINT } from "@/lib/constants/app-constants";
import { cookies } from "next/headers";
import { AccountResponse } from "../type";

export const getAccount = async (): Promise<AccountResponse> => {
  const res = await fetch(`${API_ENDPOINT}/api/user/account`, {
    credentials: "include",
    cache: "no-store",
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch account");
  }

  const data = await res.json();
  return data;
};

export const updateTradeStatus = async (
  tradeStatus: "Y" | "N"
): Promise<boolean> => {
  const res = await fetch(
    `${API_ENDPOINT}/api/user/account?tradeStatus=${tradeStatus}`,
    {
      credentials: "include",
      cache: "no-store",
      method: "PUT",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update trade status");
  }
  return true;
};
