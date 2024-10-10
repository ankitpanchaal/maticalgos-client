export interface IStrategy {
  StrategyName: string;
  AccountName: string;
  UCC: string;
  Multiplier: number;
  Activate: number;
  Capital: number;
  ID: string;
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