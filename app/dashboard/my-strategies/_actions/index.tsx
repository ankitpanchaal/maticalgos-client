import { GetAllStrategiesResponse } from "../types";

export const getMyStrategies = async (
  accName: string
): Promise<GetAllStrategiesResponse> => {
  const res = await fetch(
    process.env.NEXT_APP_URL + "/api/user/my-strategies?Acname=" + accName,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
};
