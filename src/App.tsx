import { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PanelPage } from "./pages/PanelPage";
import { RecordsPage } from "./pages/RecordsPage";
import { TimelinePage } from "./pages/TimelinePage";
import { loadState, saveState } from "./storage";
import type { AppState, Observation } from "./types";

function persist(next: AppState) {
  saveState(next);
  return next;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());

  const api = useMemo(
    () => ({
      save(draft: Omit<Observation, "id" | "updatedAt"> & { id?: string }) {
        setState((prev) => {
          const now = new Date().toISOString();
          if (draft.id) {
            const observations = prev.observations.map((item) =>
              item.id === draft.id ? { ...item, ...draft, updatedAt: now } : item,
            );
            return persist({ ...prev, observations });
          }
          const created: Observation = {
            ...draft,
            id: crypto.randomUUID(),
            updatedAt: now,
          };
          return persist({
            observations: [created, ...prev.observations],
            currentId: created.id,
          });
        });
      },
      remove(id: string) {
        setState((prev) => {
          const observations = prev.observations.filter((item) => item.id !== id);
          const currentId =
            prev.currentId === id ? (observations[0]?.id ?? null) : prev.currentId;
          return persist({ observations, currentId });
        });
      },
      setCurrent(id: string) {
        setState((prev) => persist({ ...prev, currentId: id }));
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
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
