import { useMemo, useState } from "react";
import type { Liquidity, Observation, Regime } from "../types";
import { LIQUIDITY_LABEL, REGIME_LABEL } from "../strategy";

type Props = {
  initial?: Observation | null;
  onSubmit: (draft: Omit<Observation, "id" | "updatedAt"> & { id?: string }) => void;
  onCancel?: () => void;
};

const empty = {
  observedAt: new Date().toISOString().slice(0, 10),
  symbol: "沪深300",
  liquidity: "neutral" as Liquidity,
  regime: "unclear" as Regime,
  structure: "",
  keyLevels: "",
  notes: "",
};

export function ObservationForm({ initial, onSubmit, onCancel }: Props) {
  const start = useMemo(
    () =>
      initial
        ? {
            observedAt: initial.observedAt,
            symbol: initial.symbol,
            liquidity: initial.liquidity,
            regime: initial.regime,
            structure: initial.structure,
            keyLevels: initial.keyLevels,
            notes: initial.notes,
          }
        : empty,
    [initial],
  );

  const [form, setForm] = useState(start);

  return (
    <form
      className="obs-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, id: initial?.id });
      }}
    >
      <div className="form-grid">
        <label>
          日期
          <input
            type="date"
            value={form.observedAt}
            onChange={(e) => setForm({ ...form, observedAt: e.target.value })}
            required
          />
        </label>
        <label>
          标的
          <input
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            required
          />
        </label>
        <label>
          资金环境
          <select
            value={form.liquidity}
            onChange={(e) =>
              setForm({ ...form, liquidity: e.target.value as Liquidity })
            }
          >
            {(Object.keys(LIQUIDITY_LABEL) as Liquidity[]).map((k) => (
              <option key={k} value={k}>
                {LIQUIDITY_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <label>
          行情环境
          <select
            value={form.regime}
            onChange={(e) => setForm({ ...form, regime: e.target.value as Regime })}
          >
            {(Object.keys(REGIME_LABEL) as Regime[]).map((k) => (
              <option key={k} value={k}>
                {REGIME_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        市场结构
        <textarea
          rows={2}
          value={form.structure}
          onChange={(e) => setForm({ ...form, structure: e.target.value })}
        />
      </label>
      <label>
        关键位置
        <textarea
          rows={2}
          value={form.keyLevels}
          onChange={(e) => setForm({ ...form, keyLevels: e.target.value })}
        />
      </label>
      <label>
        备注
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn primary">
          {initial ? "保存修改" : "写入观察"}
        </button>
        {onCancel ? (
          <button type="button" className="btn ghost" onClick={onCancel}>
            取消
          </button>
        ) : null}
      </div>
    </form>
  );
}
