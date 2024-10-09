import { GetAllStrategiesResponse } from "../types";

export const getAllStrategies = async (): Promise<GetAllStrategiesResponse> => {
  const res = await fetch(process.env.NEXT_APP_URL + "/api/user/strategies", {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};
