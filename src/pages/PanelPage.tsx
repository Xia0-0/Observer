import { Link } from "react-router-dom";
import { LIQUIDITY_LABEL, REGIME_LABEL, STRATEGY } from "../strategy";
import type { AppState } from "../types";

type Props = {
  state: AppState;
};

export function PanelPage({ state }: Props) {
  const current = state.observations.find((o) => o.id === state.currentId);

  if (!current) {
    return (
      <section className="page">
        <header className="page-head">
          <h2>观察面板</h2>
          <p>还没有当前观察。</p>
        </header>
        <div className="empty-card">
          <p>先写一条市场观察，面板才会给出对应纪律。</p>
          <Link className="btn primary" to="/records">
            去写记录
          </Link>
        </div>
      </section>
    );
  }

  const strategy = STRATEGY[current.regime];

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">当前市场状况</p>
          <h2>{current.symbol}</h2>
        </div>
        <time dateTime={current.observedAt}>{current.observedAt}</time>
      </header>

      <div className={`regime-banner regime-${current.regime}`}>
        <div>
          <p className="eyebrow">行情环境</p>
          <h3>{REGIME_LABEL[current.regime]}</h3>
        </div>
        <div className="strategy-block">
          <p className="eyebrow">对应策略</p>
          <h3>{strategy.title}</h3>
          <p>{strategy.rule}</p>
        </div>
      </div>

      <div className="panel-grid">
        <article className="card">
          <h4>资金环境</h4>
          <p className="lead">{LIQUIDITY_LABEL[current.liquidity]}</p>
        </article>
        <article className="card">
          <h4>市场结构</h4>
          <p>{current.structure || "未填写"}</p>
        </article>
        <article className="card">
          <h4>关键位置</h4>
          <p>{current.keyLevels || "未填写"}</p>
        </article>
        <article className="card">
          <h4>备注</h4>
          <p>{current.notes || "无"}</p>
        </article>
      </div>
    </section>
  );
}
