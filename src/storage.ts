import { seedState } from "./seed";
import type { AppState, Observation } from "./types";

const KEY = "observer.app.v1";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    return migrateState(JSON.parse(raw)) ?? seedState();
  } catch {
    return seedState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function parseImportedState(raw: string): AppState | null {
  try {
    return migrateState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function migrateState(value: unknown): AppState | null {
  if (!value || typeof value !== "object") return null;

  const parsed = value as {
    observations?: unknown;
    currentId?: unknown;
    currentIds?: unknown;
  };
  if (!Array.isArray(parsed.observations)) return null;

  const observations = parsed.observations as Observation[];
  const currentIds =
    parsed.currentIds && typeof parsed.currentIds === "object"
      ? Object.fromEntries(
          Object.entries(parsed.currentIds).filter(
            ([symbol, id]) =>
              typeof id === "string" &&
              observations.some((item) => item.symbol === symbol && item.id === id),
          ),
        )
      : {};

  if (typeof parsed.currentId === "string") {
    const current = observations.find((item) => item.id === parsed.currentId);
    if (current) currentIds[current.symbol] = current.id;
  }

  for (const observation of observations) {
    if (!currentIds[observation.symbol]) {
      currentIds[observation.symbol] = latestIdForSymbol(observations, observation.symbol);
    }
  }

  return { observations, currentIds };
}

function latestIdForSymbol(observations: Observation[], symbol: string): string {
  return observations
    .filter((item) => item.symbol === symbol)
    .sort(
      (a, b) =>
        b.observedAt.localeCompare(a.observedAt) || b.updatedAt.localeCompare(a.updatedAt),
    )[0]!.id;
}
