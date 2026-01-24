import React from "react";
import Card from "../../../dashboard/admin/components/ui/Card";

export default function StackedMini({
  title,
  subtitle,
  rows,
  maxRows = 6,
  icon,
  onRowClick,
  right,
}) {
  const sliced = (rows || []).slice(0, maxRows);

  const getSegments = (r) => {
    if (Array.isArray(r.segments) && r.segments.length) return r.segments;

    // fallback legacy
    return [
      { key: "active", label: "ACTIVE", value: Number(r.active || 0), color: "var(--mc)" },
      { key: "transferred", label: "TRANSFER", value: Number(r.transferred || 0), color: "rgba(99,102,241,.55)" },
      { key: "inactive", label: "INACTIVE", value: Number(r.inactive || 0), color: "var(--border)" },
    ];
  };

  const totals = sliced.map((r) => getSegments(r).reduce((s, x) => s + (Number(x.value) || 0), 0));
  const max = Math.max(1, ...totals);

  // auto legend from first row segments (if any)
  const legendSegs = sliced[0] ? getSegments(sliced[0]) : [];

  return (
    <Card
      title={title}
      subtitle={subtitle}
      icon={icon}
      right={
        right ?? (
          <div className="clm-legendMini">
            {legendSegs.slice(0, 4).map((s) => (
              <span key={s.key} className="clm-legendMini__it">
                <span className="clm-dot" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        )
      }
    >
      <div className="clm-stack">
        {sliced.map((r, idx) => {
          const segs = getSegments(r);
          const total = segs.reduce((s, x) => s + (Number(x.value) || 0), 0);

          const clickable = !!(r.onClick || onRowClick);
          const handleRow = () => {
            if (r.onClick) return r.onClick(r);
            if (onRowClick) return onRowClick(r);
          };

          return (
            <div
              key={r.key || idx}
              className={`clm-stackRow ${clickable ? "is-clickable" : ""}`}
              onClick={clickable ? handleRow : undefined}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : -1}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") handleRow();
                    }
                  : undefined
              }
              title={r?.meta?.hint || ""}
            >
              <div className="clm-stackRow__lbl">
                <div className="clm-strong">{r.label}</div>
                {r?.meta?.hint ? <div className="clm-muted clm-mt2">{r.meta.hint}</div> : null}
              </div>

              <div className="clm-stackRow__bar" title={`Tổng: ${total}`}>
                {segs.map((s) => {
                  const w = Math.round(((Number(s.value) || 0) / max) * 100);
                  return (
                    <div
                      key={s.key}
                      className="clm-stackRow__seg"
                      style={{ width: `${w}%`, background: s.color }}
                      aria-label={`${s.label}: ${s.value}`}
                    />
                  );
                })}
              </div>

              <div className="clm-stackRow__val">{total}</div>

              {Array.isArray(r.actions) && r.actions.length ? (
                <div
                  className="clm-stackRow__actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.actions.slice(0, 2).map((a, i) => (
                    <button
                      key={`${r.key || idx}_a_${i}`}
                      type="button"
                      className="clm-actBtn"
                      onClick={() => a.onClick(r)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>


    </Card>
  );
}
