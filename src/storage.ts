import { seedState } from "./seed";
import type { AppState } from "./types";

const KEY = "observer.app.v1";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as AppState;
    if (!Array.isArray(parsed.observations)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
