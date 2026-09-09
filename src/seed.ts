import type { AppState } from "./types";

export function seedState(): AppState {
  const observations = [
    {
      id: "obs-1",
      observedAt: "2026-08-18",
      symbol: "沪深300",
      liquidity: "loose" as const,
      regime: "trend" as const,
      structure: "指数沿 5 日线上行，回调不破 20 日线。",
      keyLevels: "支撑 3920；压力 4080。",
      notes: "成交额放大，主线仍在金融与资源。",
      updatedAt: "2026-08-18T10:00:00.000Z",
    },
    {
      id: "obs-2",
      observedAt: "2026-08-27",
      symbol: "沪深300",
      liquidity: "neutral" as const,
      regime: "range" as const,
      structure: "冲高回落，落入 3920–4010 箱体。",
      keyLevels: "箱底 3920；箱顶 4010。",
      notes: "量能回落，趋势节奏被打断。",
      updatedAt: "2026-08-27T10:00:00.000Z",
    },
    {
      id: "obs-3",
      observedAt: "2026-09-04",
      symbol: "沪深300",
      liquidity: "tight" as const,
      regime: "unclear" as const,
      structure: "箱底得而复失，高低点开始纠缠。",
      keyLevels: "3900 得失；上方 3980 反复。",
      notes: "资金面转紧，方向未重新确认。",
      updatedAt: "2026-09-04T10:00:00.000Z",
    },
    {
      id: "obs-4",
      observedAt: "2026-09-09",
      symbol: "沪深300",
      liquidity: "neutral" as const,
      regime: "range" as const,
      structure: "重新站回箱体下沿，但仍缺趋势延伸。",
      keyLevels: "支撑 3910；压力 3995。",
      notes: "今日观察：区间思路优先，等突破再改环境。",
      updatedAt: "2026-09-09T02:00:00.000Z",
    },
  ];

  return { observations, currentId: "obs-4" };
}
