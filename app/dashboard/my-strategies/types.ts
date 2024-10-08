export interface IStrategy {
  id: string;
  name: string;
  pnl: number;
  status: "active" | "inactive";
}
