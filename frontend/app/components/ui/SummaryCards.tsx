export interface SummaryCard {
  label: string;
  value: string | number;
  tone?: string; // tailwind text color class
}

// A single bordered "readout strip" divided by hairlines, rather than a
// grid of separate white cards — reads like a multi-channel gauge panel
// on a control console. Wraps to multiple rows on narrow screens.
export function SummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded border border-line bg-panel">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`min-w-[140px] flex-1 px-4 py-3 ${
            i !== 0 ? 'border-l border-line' : ''
          }`}
        >
          <p className="console-label text-[10px] text-slate-500">{card.label}</p>
          <p className={`mt-1 font-mono text-lg font-semibold ${card.tone ?? 'text-slate-100'}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
