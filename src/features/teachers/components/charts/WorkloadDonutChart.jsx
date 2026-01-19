
import React from 'react';

export default function WorkloadDonutChart({ stats }) {
  if (!stats || !stats.bands) return null;

  const { bands, top5, bottom5, avgSessions, overloadCount, totalCount } = stats;

  const r = 40;
  const c = 2 * Math.PI * r;
  const total = totalCount || 1;

  // Calculate segments
  const segs = bands.reduce((acc, b) => {
    const frac = b.value / total;
    const dash = frac * c;
    const gap = c - dash;
    const start = acc.currentOffset;
    
    // Accumulate offset for next iteration
    acc.currentOffset += dash;
    
    acc.items.push({ ...b, dash, gap, start });
    return acc;
  }, { currentOffset: 0, items: [] }).items;

  return (
    <div className="at-workload-widget">
      {/* Left: Donut */}
      <div className="at-donut-wrap">
        <svg className="at-donut" viewBox="0 0 100 100">
          <circle className="at-donut__bg" cx="50" cy="50" r={r} />
          {segs.map((s, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.start}
              className="at-donut__seg"
            >
              <title>{`${s.label}: ${s.value} GV (${Math.round((s.value / total) * 100)}%)`}</title>
            </circle>
          ))}
          <text x="50" y="44" textAnchor="middle" className="at-donut__val text-danger">
            {overloadCount}
          </text>
          <text x="50" y="58" textAnchor="middle" className="at-donut__lbl">
            Overload
          </text>
           <text x="50" y="70" textAnchor="middle" className="at-donut__sub" style={{ fontSize: '6px', fill: 'var(--ts)' }}>
            Avg: {avgSessions}/wk
          </text>
        </svg>
      </div>

      {/* Right: Legend & Insights */}
      <div className="at-workload-info">
        
        {/* Legend */}
        <div className="at-legend-grid">
          {bands.map((b) => (
            <div className="at-legend-item" key={b.key}>
              <span className="at-dot" style={{ background: b.color }}></span>
              <div className="at-legend-text">
                <span className="at-legend-label">{b.label}</span>
                <span className="at-legend-val">{b.value} GV</span>
              </div>
            </div>
          ))}
        </div>

        <div className="at-divider"></div>

        {/* Top/Bottom Insights */}
        <div className="at-lists">
          <div className="at-list-group">
            <div className="at-list-title">Top Workload</div>
            {top5.map((t) => (
              <div className="at-list-row" key={t.teacher_id}>
                <span className="at-list-name">{t.full_name}</span>
                <span className="at-badge at-badge--high">{t.weeklySessions}</span>
              </div>
            ))}
          </div>
           <div className="at-list-group">
            <div className="at-list-title">Lowest Workload</div>
            {bottom5.map((t) => (
              <div className="at-list-row" key={t.teacher_id}>
                <span className="at-list-name">{t.full_name}</span>
                <span className="at-badge at-badge--low">{t.weeklySessions}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
