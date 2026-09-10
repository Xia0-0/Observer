import { useState } from "react";
import { SymbolFilter } from "../components/SymbolFilter";
import { LIQUIDITY_LABEL, REGIME_LABEL } from "../strategy";
import type { AppState, Observation } from "../types";

type Props = {
  state: AppState;
  onSetCurrent: (id: string) => void;
};

export function TimelinePage({ state, onSetCurrent }: Props) {
  const symbols = [...new Set(state.observations.map((item) => item.symbol))].sort();
  const [symbol, setSymbol] = useState("all");
  const items = state.observations
    .filter((item) => symbol === "all" || item.symbol === symbol)
    .sort((a, b) =>
      b.observedAt.localeCompare(a.observedAt),
    );

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">历史环境</p>
          <h2>环境时间线</h2>
        </div>
        <SymbolFilter
          symbols={symbols}
          value={symbol}
          onChange={setSymbol}
          includeAll
        />
      </header>
      {items.length ? (
        <ol className="timeline">
          {items.map((item, i) => {
            const next = items[i + 1];
            const changed = Boolean(
              next && next.symbol === item.symbol && next.regime !== item.regime,
            );
            return (
              <TimelineItem
                key={item.id}
                item={item}
                changed={changed}
                previous={next}
                isCurrent={item.id === state.currentIds[item.symbol]}
                onSetCurrent={onSetCurrent}
              />
            );
          })}
        </ol>
      ) : (
        <div className="empty-card">
          <p>{symbol === "all" ? "还没有可回看的观察记录。" : `还没有 ${symbol} 的观察记录。`}</p>
        </div>
      )}
    </section>
  );
}

function TimelineItem({
  item,
  changed,
  previous,
  isCurrent,
  onSetCurrent,
}: {
  item: Observation;
  changed: boolean;
  previous?: Observation;
  isCurrent: boolean;
  onSetCurrent: (id: string) => void;
}) {
  return (
    <li className={`timeline-item regime-${item.regime} ${isCurrent ? "is-current" : ""}`}>
      <div className="timeline-dot" />
      <div className="timeline-body">
        <div className="timeline-meta">
          <time>{item.observedAt}</time>
          <span className="tag">{REGIME_LABEL[item.regime]}</span>
          <span className="tag muted">{LIQUIDITY_LABEL[item.liquidity]}</span>
          {isCurrent ? <span className="tag current">当前</span> : null}
        </div>
        {changed && previous ? (
          <p className="shift">
            环境切换：{REGIME_LABEL[previous.regime]} → {REGIME_LABEL[item.regime]}
          </p>
        ) : null}
        <p className="symbol">{item.symbol}</p>
        <p>{item.structure}</p>
        <p className="levels">{item.keyLevels}</p>
        {item.notes ? <p className="notes">{item.notes}</p> : null}
        {!isCurrent ? (
          <button className="btn ghost small" onClick={() => onSetCurrent(item.id)}>
            设为当前
          </button>
        ) : null}
      </div>
    </li>
  );
}
