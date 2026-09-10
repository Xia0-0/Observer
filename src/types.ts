export type Regime = "trend" | "range" | "unclear";
export type Liquidity = "loose" | "neutral" | "tight";

export type Observation = {
  id: string;
  observedAt: string;
  symbol: string;
  liquidity: Liquidity;
  regime: Regime;
  structure: string;
  keyLevels: string;
  notes: string;
  updatedAt: string;
};

export type AppState = {
  observations: Observation[];
  currentIds: Record<string, string>;
};
