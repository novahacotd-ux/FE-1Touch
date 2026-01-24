import React from "react";
import { fmtPct } from "../../utils/classHelpers";


export default function Donut({ items, centerTop, centerBottom, onItemClick }) {
  const total = (items || []).reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
  const r = 34;
  const c = 2 * Math.PI * r;

  let acc = 0;
  const segs = (items || []).reduce((accArr, it) => {
    const frac = (Number(it.value) || 0) / total;
    const dash = frac * c;
    const gap = c - dash;
    const start = acc;
    acc += dash;
    accArr.push({ ...it, dash, gap, start });
    return accArr;
  }, []);

  const clickItem = (it) => {
    if (typeof it.onClick === "function") return it.onClick(it);
    if (typeof onItemClick === "function") return onItemClick(it);
  };

  return (
    <div className="clm-donutWrap">
      <svg className="clm-donut" viewBox="0 0 100 100" role="img" aria-label="donut chart">
        <circle className="clm-donut__bg" cx="50" cy="50" r={r} />
        {segs.map((s, i) => {
          const clickable = !!(s.onClick || onItemClick);
          return (
            <circle
              key={i}
              className={`clm-donut__seg ${clickable ? "is-clickable" : ""}`}
              cx="50"
              cy="50"
              r={r}
              stroke={s.color}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.start}
              onClick={clickable ? () => clickItem(s) : undefined}
            />
          );
        })}
        <text x="50" y="48" textAnchor="middle" className="clm-donut__big">
          {centerTop}
        </text>
        <text x="50" y="62" textAnchor="middle" className="clm-donut__small">
          {centerBottom}
        </text>
      </svg>

      <div className="clm-donutLegend">
        {(items || []).map((it, idx) => {
          const clickable = !!(it.onClick || onItemClick);
          return (
            <div
              key={idx}
              className={`clm-donutLegend__row ${clickable ? "is-clickable" : ""}`}
              onClick={clickable ? () => clickItem(it) : undefined}
              title={it.hint || ""}
            >
              <span className="clm-dot" style={{ background: it.color }} />
              <div className="clm-donutLegend__main">
                <div className="clm-donutLegend__label">{it.label}</div>
                <div className="clm-donutLegend__meta">
                  <span className="clm-muted">{it.value}</span>
                  <span className="clm-muted">•</span>
                  <span className="clm-muted">{fmtPct((Number(it.value) || 0) / total)}</span>
                  {it.hint ? <span className="clm-muted">• {it.hint}</span> : null}
                </div>
              </div>

              {it.actionLabel && typeof it.onAction === "function" ? (
                <button
                  type="button"
                  className="clm-actBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    it.onAction(it);
                  }}
                >
                  {it.actionLabel}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>


    </div>
  );
}
