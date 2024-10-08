export interface Strategy {
  id: string;
  name: string;
  type: string;
  marginRequired: number;
  description: string;
}

export interface StrategyExplorerProps {
  strategies: Strategy[];
}

export interface StrategyTableProps {
  strategies: Strategy[];
  subscribedStrategies: Set<string>;
  onSubscribe: (strategyId: string) => void;
  onToggleAccordion: (strategyId: string) => void;
  expandedStrategy: string | null;
}

export interface StrategyAccordionProps {
  strategies: Strategy[];
  expandedStrategy: string | null;
}
