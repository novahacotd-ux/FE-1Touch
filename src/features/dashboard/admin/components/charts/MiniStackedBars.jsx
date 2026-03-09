
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

export default function MiniStackedBars({ data }) {
  // data: [{label, a, b, c}] (present/late/absent)
  const max = Math.max(...data.map((d) => d.a + d.b + d.c), 1);
  return (
    <div className="miniBars">
      {data.map((d) => {
        const total = d.a + d.b + d.c;
        const p = (total / max) * 100;
        const a = (d.a / total) * 100;
        const b = (d.b / total) * 100;
        const c = 100 - a - b;
        return (
          <div key={d.label} className="miniBar" title={`${d.label}: P ${formatInt(d.a)} • L ${formatInt(d.b)} • A ${formatInt(d.c)}`}>
            <div className="miniBarTrack" style={{ height: `${Math.max(10, p * 0.6)}%` }}>
              <div className="miniSeg miniSeg--good" style={{ height: `${a}%` }} />
              <div className="miniSeg miniSeg--warn" style={{ height: `${b}%` }} />
              <div className="miniSeg miniSeg--bad" style={{ height: `${c}%` }} />
            </div>
            <div className="miniBarLabel">{d.label.replace('Tiết ', 'T')}</div>
          </div>
        );
      })}
    </div>
  );
}
