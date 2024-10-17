export interface IStrategy {
  StrategyName: string;
  AccountName: string;
  UCC: string;
  Multiplier: number;
  Activate: number;
  Capital: number;
  ID: number;
  bookedpnl: number;
  openpnl: number;
  totalpnl: number;
  totalpositions: number;
  openpositions: number;
}

export interface GetAllStrategiesResponse {
  status: boolean;
  error: boolean;
  data: IStrategy[];
  message: string;
}

export interface OrderBookItem {
  UCC: string;
  AccountName: string;
  strefID: number;
  reftag: number;
  StrategyName: string;
  orderType: string;
  productType: string;
  price: number;
  limitPrice: number;
  triggerPrice: number;
  token: string;
  segment: string;
  symbol: string;
  qty: number;
  transType: string;
  splitby: number;
  Operations: string;
  ordersplaced: number;
  ordersdone: number;
  ordersexecuted: number;
  placed_at: string;
  recon_at: string;
  trade_at: string;
  filledQty: number;
  tradedQty: number;
  tradeValue: number;
  tradePrice: number;
  status: string;
  active: number;
  ForwardTest: null | any;
}

export interface OrderBookResponse {
  status: boolean;
  error: boolean;
  data: OrderBookItem[];
  message: string;
}



export interface IntradayResponse {
  status: boolean;
  error: boolean;
  data: IntradayData[];
}

export interface IntradayData {
  Datetime: string;
  PNL: number;
}

export interface OrderDetailsResponse {
  status: boolean;
  error: boolean;
  data: OrderDetailsItem[];
  message: string;
}

export type OrderDetailsItem = OrderBookItem & {
orders: OrderBookItem[];
}

export type TOrderModalType = "DETAILS" | "RE_EXECUTE" | null