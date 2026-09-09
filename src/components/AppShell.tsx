import { NavLink, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">MARKET NOTE</p>
          <h1>观察者</h1>
          <p className="brand-sub">先看清环境，再决定是否交易</p>
        </div>
        <nav>
          <NavLink to="/" end>
            观察面板
          </NavLink>
          <NavLink to="/timeline">环境时间线</NavLink>
          <NavLink to="/records">观察记录</NavLink>
        </nav>
        <p className="sidebar-note">本地记录 · 不拉行情 · 不自动分析</p>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
