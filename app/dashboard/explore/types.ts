export interface IStrategy {
  ID: number;
  StrategyName: string;
  Description: string;
  StrategyType: string;
  UCC: string;
  Display: string;
  ForwardTest: string;
}
export interface ILinkedStrategy {
  StrategyName: string;
  AccountName: string;
  UCC: string;
  Multiplier: number;
  Activate: number;
  Capital: number;
}

export interface StrategyExplorerProps {
  strategies: IStrategy[];
}

export interface StrategyTableProps {
  strategies: IStrategy[];
  subscribedStrategies: Set<string>;
  onSubscribe: (strategyId: string) => void;
  onToggleAccordion: (strategyId: string) => void;
  expandedStrategy: string | null;
}

export interface StrategyAccordionProps {
  strategies: IStrategy[];
  expandedStrategy: string | null;
}

export interface GetAllStrategiesResponse {
  status: boolean;
  error: boolean;
  data: IStrategy[];
}

export interface GetLinkStrategiesResponse {
  status: boolean;
  error: boolean;
  data: ILinkedStrategy[];
}
