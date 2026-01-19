
import React from 'react';

export default function BarChart({ items }) {
  const max = Math.max(...items.map((x) => x.value), 1);
  return (
    <div className="at-bars">
      {items.map((it) => (
        <div key={it.label} className="at-barRow">
          <div className="at-barRow__label">{it.label}</div>
          <div className="at-barRow__track">
            <div className="at-barRow__fill" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
          <div className="at-barRow__val">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
