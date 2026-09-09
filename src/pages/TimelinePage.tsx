import { LIQUIDITY_LABEL, REGIME_LABEL } from "../strategy";
import type { AppState, Observation } from "../types";

type Props = {
  state: AppState;
  onSetCurrent: (id: string) => void;
};

export function TimelinePage({ state, onSetCurrent }: Props) {
  const items = [...state.observations].sort((a, b) =>
    b.observedAt.localeCompare(a.observedAt),
  );

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">历史环境</p>
          <h2>环境时间线</h2>
        </div>
      </header>
      <ol className="timeline">
        {items.map((item, i) => {
          const next = items[i + 1];
          const changed = Boolean(next && next.regime !== item.regime);
          return (
            <TimelineItem
              key={item.id}
              item={item}
              changed={changed}
              previous={next}
              isCurrent={item.id === state.currentId}
              onSetCurrent={onSetCurrent}
            />
          );
        })}
      </ol>
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
        {!isCurrent ? (
          <button className="btn ghost small" onClick={() => onSetCurrent(item.id)}>
            设为当前
          </button>
        ) : null}
      </div>
    </li>
  );
}
