import { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PanelPage } from "./pages/PanelPage";
import { RecordsPage } from "./pages/RecordsPage";
import { TimelinePage } from "./pages/TimelinePage";
import { loadState, parseImportedState, saveState } from "./storage";
import type { AppState, Observation } from "./types";

function persist(next: AppState) {
  saveState(next);
  return next;
}

function latestIdForSymbol(observations: Observation[], symbol: string): string | undefined {
  return observations
    .filter((item) => item.symbol === symbol)
    .sort(
      (a, b) =>
        b.observedAt.localeCompare(a.observedAt) || b.updatedAt.localeCompare(a.updatedAt),
    )[0]?.id;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());

  const api = useMemo(
    () => ({
      save(draft: Omit<Observation, "id" | "updatedAt"> & { id?: string }) {
        setState((prev) => {
          const now = new Date().toISOString();
          if (draft.id) {
            const existing = prev.observations.find((item) => item.id === draft.id);
            const observations = prev.observations.map((item) =>
              item.id === draft.id ? { ...item, ...draft, updatedAt: now } : item,
            );
            if (!existing) return persist({ ...prev, observations });

            const currentIds = { ...prev.currentIds };
            if (currentIds[existing.symbol] === existing.id && existing.symbol !== draft.symbol) {
              const nextId = latestIdForSymbol(
                observations.filter((item) => item.id !== existing.id),
                existing.symbol,
              );
              if (nextId) currentIds[existing.symbol] = nextId;
              else delete currentIds[existing.symbol];
              currentIds[draft.symbol] = existing.id;
            }
            return persist({ observations, currentIds });
          }
          const created: Observation = {
            ...draft,
            id: crypto.randomUUID(),
            updatedAt: now,
          };
          return persist({
            observations: [created, ...prev.observations],
            currentIds: { ...prev.currentIds, [created.symbol]: created.id },
          });
        });
      },
      remove(id: string) {
        setState((prev) => {
          const removed = prev.observations.find((item) => item.id === id);
          const observations = prev.observations.filter((item) => item.id !== id);
          if (!removed) return persist({ ...prev, observations });

          const currentIds = { ...prev.currentIds };
          if (currentIds[removed.symbol] === id) {
            const nextId = latestIdForSymbol(observations, removed.symbol);
            if (nextId) currentIds[removed.symbol] = nextId;
            else delete currentIds[removed.symbol];
          }
          return persist({ observations, currentIds });
        });
      },
      setCurrent(id: string) {
        setState((prev) => {
          const observation = prev.observations.find((item) => item.id === id);
          if (!observation) return prev;
          return persist({
            ...prev,
            currentIds: { ...prev.currentIds, [observation.symbol]: id },
          });
        });
      },
      importJson(raw: string): boolean {
        const next = parseImportedState(raw);
        if (!next) return false;
        setState(() => persist(next));
        return true;
      },
      clear() {
        setState(() => persist({ observations: [], currentIds: {} }));
      },
    }),
    [],
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<PanelPage state={state} />} />
          <Route
            path="/timeline"
            element={<TimelinePage state={state} onSetCurrent={api.setCurrent} />}
          />
          <Route
            path="/records"
            element={
              <RecordsPage
                state={state}
                onSave={api.save}
                onDelete={api.remove}
                onSetCurrent={api.setCurrent}
                onImport={api.importJson}
                onClear={api.clear}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
