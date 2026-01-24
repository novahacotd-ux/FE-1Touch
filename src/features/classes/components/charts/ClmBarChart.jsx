import React from "react";
import Card from "../../../dashboard/admin/components/ui/Card";

export default function BarChart({
  title,
  subtitle,
  data,
  maxBars = 10,
  icon,
  onRowClick,
  valueSuffix = "",
  formatValue,
}) {
  const sliced = (data || []).slice(0, maxBars);
  const max = Math.max(1, ...sliced.map((d) => Number(d.value || 0)));

  const fmt = (n, it) => {
    if (typeof formatValue === "function") return formatValue(n, it);
    const suffix = it?.meta?.suffix ?? valueSuffix;
    return `${n}${suffix}`;
  };

  return (
    <Card title={title} subtitle={subtitle} icon={icon}>
      <div className="clm-barchart">
        {sliced.map((d) => {
          const v = Number(d.value || 0);
          const w = Math.round((v / max) * 100);

          const clickable = !!(d.onClick || onRowClick);
          const handleRow = () => {
            if (d.onClick) return d.onClick(d);
            if (onRowClick) return onRowClick(d);
          };

          return (
            <div
              key={d.key}
              className={`clm-barRow ${clickable ? "is-clickable" : ""}`}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : -1}
              onClick={clickable ? handleRow : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") handleRow();
                    }
                  : undefined
              }
              title={d?.meta?.hint || ""}
            >
              <div className="clm-barRow__lbl">
                {d.label}
                {d?.meta?.hint ? (
                  <span className="clm-muted clm-barRow__hint">• {d.meta.hint}</span>
                ) : null}
              </div>

              <div className="clm-barRow__bar">
                <div className="clm-barRow__fill" style={{ width: `${w}%` }} />
              </div>

              <div className="clm-barRow__val">{fmt(v, d)}</div>

              {Array.isArray(d.actions) && d.actions.length > 0 ? (
                <div
                  className="clm-barRow__actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {d.actions.slice(0, 2).map((a, idx) => (
                    <button
                      key={a.key || `${d.key}_act_${idx}`}
                      className="clm-actBtn"
                      type="button"
                      onClick={() => a.onClick(d)}
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
