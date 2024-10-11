import { API_ENDPOINT } from "@/lib/constants/app-constants";
import { GetAllStrategiesResponse, GetLinkStrategiesResponse } from "../types";
import { cookies } from "next/headers";

export const getAllStrategies = async (): Promise<GetAllStrategiesResponse> => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const res = await fetch(API_ENDPOINT + "/api/user/strategies", {
    headers: {
      Cookie: `token=${token?.value || ""}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return data;
};


