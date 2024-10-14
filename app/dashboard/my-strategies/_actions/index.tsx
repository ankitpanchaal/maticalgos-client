import { API_ENDPOINT } from "@/lib/constants/app-constants";
import {
  GetAllStrategiesResponse,
  IntradayResponse,
  OrderBookResponse,
  OrderDetailsResponse,
} from "../types";

export const getMyStrategies = async (): Promise<GetAllStrategiesResponse> => {
  const res = await fetch(API_ENDPOINT + "/api/user/my-strategies", {
    credentials: "include",
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export const modifyStrategyStatus = async (
  StrategyID: number,
  StrategyName: string,
  Activate: number
): Promise<{ message: string }> => {
  const res = await fetch(API_ENDPOINT + "/api/user/link-strategies", {
    credentials: "include",
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify({ StrategyID, StrategyName, Activate }),
  });
  const data = await res.json();
  return data;
};

export const squreOffStrategy = async (
  StrategyName: string
): Promise<{ message: string }> => {
  const res = await fetch(
    API_ENDPOINT + "/api/user/my-strategies?stname=" + StrategyName,
    {
      credentials: "include",
      cache: "no-store",
      method: "PATCH",
    }
  );
  const data = await res.json();
  return data;
};

export const fetchOrderBook = async (
  acname: string,
  stname: string
): Promise<OrderBookResponse> => {
  const res = await fetch(
    `/api/user/orderbook?acname=${acname}&stname=${stname}`
  );
  const data = await res.json();
  return data;
};

export const fetchIntradayPNL = async (
  stname: string
): Promise<IntradayResponse> => {
  const res = await fetch(
    `/api/user/intraday-pnl?stname=${stname}`
  );
  const data = await res.json();
  return data;
};

export const fetchOrderDetails = async (
  reftag: number, strefid: number
): Promise<OrderDetailsResponse> => {
  const res = await fetch(
    `/api/user/orderbook?reftag=${reftag}&strefid=${strefid}`,
    {
      method: "POST",
    }
  );
  const data = await res.json();
  return data;
};
