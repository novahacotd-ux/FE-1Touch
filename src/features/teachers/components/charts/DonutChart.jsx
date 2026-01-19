
import React from 'react';

export default function DonutChart({ items }) {
  const total = items.reduce((s, x) => s + x.value, 0) || 1;
  const r = 34;
  const c = 2 * Math.PI * r;

  let acc = 0;
  const segs = items.map((it, idx) => {
    const frac = it.value / total;
    const dash = frac * c;
    const gap = c - dash;
    const start = acc;
    acc += dash;

    // use CSS variables for colors (we keep it consistent in theme)
    const stroke = idx === 0 ? "var(--mc)" : "var(--border)";
    return { dash, gap, start, stroke, label: it.label, value: it.value };
  });

  return (
    <svg className="at-donut" viewBox="0 0 100 100" role="img" aria-label="donut chart">
      <circle className="at-donut__bg" cx="50" cy="50" r={r} />
      {segs.map((s, i) => (
        <circle
          key={i}
          className="at-donut__seg"
          cx="50"
          cy="50"
          r={r}
          stroke={s.stroke}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.start}
        />
      ))}
      <text x="50" y="48" textAnchor="middle" className="at-donut__big">
        {total}
      </text>
      <text x="50" y="62" textAnchor="middle" className="at-donut__small">
        GV
      </text>
    </svg>
  );
}
