import { useState } from "react";
import { ObservationForm } from "../components/ObservationForm";
import { LIQUIDITY_LABEL, REGIME_LABEL } from "../strategy";
import type { AppState, Observation } from "../types";

type Props = {
  state: AppState;
  onSave: (draft: Omit<Observation, "id" | "updatedAt"> & { id?: string }) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
};

export function RecordsPage({ state, onSave, onDelete, onSetCurrent }: Props) {
  const [editing, setEditing] = useState<Observation | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = [...state.observations].sort((a, b) =>
    b.observedAt.localeCompare(a.observedAt),
  );

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">写入</p>
          <h2>市场观察记录</h2>
        </div>
        <button
          className="btn primary"
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
        >
          新建观察
        </button>
      </header>

      {creating || editing ? (
        <div className="card form-card">
          <h3>{editing ? "编辑观察" : "新观察"}</h3>
          <ObservationForm
            key={editing?.id ?? "new"}
            initial={editing}
            onSubmit={(draft) => {
              onSave(draft);
              setEditing(null);
              setCreating(false);
            }}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        </div>
      ) : null}

      <div className="table-wrap">
        <table className="records">
          <thead>
            <tr>
              <th>日期</th>
              <th>标的</th>
              <th>行情环境</th>
              <th>资金环境</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.id === state.currentId ? "is-current" : ""}>
                <td>{row.observedAt}</td>
                <td>{row.symbol}</td>
                <td>{REGIME_LABEL[row.regime]}</td>
                <td>{LIQUIDITY_LABEL[row.liquidity]}</td>
                <td className="row-actions">
                  {row.id !== state.currentId ? (
                    <button className="btn ghost small" onClick={() => onSetCurrent(row.id)}>
                      设为当前
                    </button>
                  ) : (
                    <span className="tag current">当前</span>
                  )}
                  <button
                    className="btn ghost small"
                    onClick={() => {
                      setCreating(false);
                      setEditing(row);
                    }}
                  >
                    编辑
                  </button>
                  <button className="btn ghost small danger" onClick={() => onDelete(row.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
