
import React from "react";

export default function DonutActionable({ items, centerTop, centerBottom, onItemClick }) {
  const total = items.reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
  const r = 34;
  const c = 2 * Math.PI * r;

  const { segs } = items.reduce(
    (accState, it) => {
      const frac = (Number(it.value) || 0) / total;
      const dash = frac * c;
      const gap = c - dash;
      const start = accState.current;
      accState.current += dash;
      accState.segs.push({ ...it, dash, gap, start });
      return accState;
    },
    { current: 0, segs: [] }
  );

  return (
    <div className="donutWrap">
      <svg className="donut" viewBox="0 0 100 100" role="img" aria-label="donut chart">
        <circle className="donut__bg" cx="50" cy="50" r={r} />
        {segs.map((s, i) => (
          <circle
            key={i}
            className={`donut__seg ${onItemClick ? "is-clickable" : ""}`}
            cx="50"
            cy="50"
            r={r}
            stroke={s.color}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.start}
            onClick={onItemClick ? () => onItemClick(s) : undefined}
          />
        ))}
        <text x="50" y="48" textAnchor="middle" className="donut__big">
          {centerTop}
        </text>
        <text x="50" y="62" textAnchor="middle" className="donut__small">
          {centerBottom}
        </text>
      </svg>

      <div className="donutLegend">
        {items.map((it, idx) => (
          <div
            key={idx}
            className={`donutLegend__row ${onItemClick ? "is-clickable" : ""}`}
            onClick={onItemClick ? () => onItemClick(it) : undefined}
          >
            <span className="dot" style={{ background: it.color }} />
            <div className="donutLegend__main">
              <div className="strong">{it.label}</div>
              <div className="muted">
                {it.value} • {Math.round(((Number(it.value) || 0) / total) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
