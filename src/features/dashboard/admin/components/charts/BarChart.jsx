
import React from 'react';
import { formatInt } from '../../utils/dashboardHelpers';

function LegendDot({ color, label, x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="5" fill={color} />
      <text x="10" y="4" className="chartLegend">
        {label}
      </text>
    </g>
  );
}

export default function BarChart({ height = 220, data, labelA, labelB }) {
  // data: [{label, value, a, b}]
  const width = 560;
  const padding = { l: 24, r: 12, t: 12, b: 34 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;
  const n = data.length || 1;
  const gap = 12;
  const barW = (innerW - gap * (n - 1)) / n;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      {[0.25, 0.5, 0.75, 1].map((p) => {
        const y = padding.t + innerH * (1 - p);
        return <line key={p} x1={padding.l} x2={width - padding.r} y1={y} y2={y} className="gridLine" />;
      })}

      {data.map((d, i) => {
        const x = padding.l + i * (barW + gap);
        const totalH = (d.value / max) * innerH;
        const y0 = padding.t + innerH - totalH;
        const aH = (d.a / (d.value || 1)) * totalH;
        const bH = totalH - aH;

        return (
          <g key={d.label}>
            <rect x={x} y={y0} width={barW} height={aH} rx="10" fill="var(--warn)" opacity="0.92">
              <title>
                {d.label} — {labelA}: {formatInt(d.a)}
              </title>
            </rect>
            <rect x={x} y={y0 + aH} width={barW} height={bH} rx="10" fill="var(--bad)" opacity="0.9">
              <title>
                {d.label} — {labelB}: {formatInt(d.b)}
              </title>
            </rect>
            <text x={x + barW / 2} y={height - 12} textAnchor="middle" className="axisLabel">
              {d.label}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${padding.l}, ${8})`}>
        <LegendDot color="var(--warn)" label={labelA} />
        <LegendDot color="var(--bad)" label={labelB} x={70} />
      </g>
    </svg>
  );
}
