import type { Regime } from "./types";

export const REGIME_LABEL: Record<Regime, string> = {
  trend: "趋势行情",
  range: "震荡行情",
  unclear: "环境不明确",
};

export const LIQUIDITY_LABEL = {
  loose: "宽松",
  neutral: "中性",
  tight: "收紧",
} as const;

export const STRATEGY = {
  trend: {
    title: "顺势交易",
    rule: "方向跟随已确认趋势，不逆势抄底摸顶。",
  },
  range: {
    title: "低吸高抛",
    rule: "在关键位置附近做区间，不做趋势加仓幻想。",
  },
  unclear: {
    title: "观察，不交易",
    rule: "允许记录，不允许把不确定当成信号。",
  },
} as const;
