import { API_ENDPOINT } from "@/lib/constants/app-constants";
import { GetAllStrategiesResponse } from "../types";

export const getMyStrategies = async (
  accName: string
): Promise<GetAllStrategiesResponse> => {
  const res = await fetch(
    API_ENDPOINT + "/api/user/my-strategies?Acname=" + accName,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
};
