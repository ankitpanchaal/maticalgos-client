import { GetLinkStrategiesResponse } from "../types";

export const linkStartegyToAccount = async (
  StrategyID: number,
  StrategyName: string,
  type: "subscribe" | "unsubscribe"
): Promise<any> => {
  const res = await fetch(`/api/user/link-strategies`, {
    credentials: "include",
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ StrategyID, StrategyName, type }),
  });
  const data = await res.json();
  return data;
};

export const getLinkedStrategies =
  async (): Promise<GetLinkStrategiesResponse> => {
    const res = await fetch(`/api/user/link-strategies`, {
      cache: "no-store",
      credentials: "include",
      method: "GET",
    });

    const data = await res.json();
    return data;
  };
