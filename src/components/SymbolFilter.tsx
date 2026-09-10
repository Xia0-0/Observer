type Props = {
  symbols: string[];
  value: string;
  onChange: (symbol: string) => void;
  includeAll?: boolean;
};

export function SymbolFilter({ symbols, value, onChange, includeAll = false }: Props) {
  return (
    <label className="symbol-filter">
      标的
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {includeAll ? <option value="all">全部标的</option> : null}
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </label>
  );
}
