import React from "react";

export default function Chip({ tone = "neutral", children, icon }) {
  return (
    <span className={`clm-chip clm-chip--${tone}`}>
      {icon ? <span className="clm-chip__ic">{icon}</span> : null}
      <span className="clm-chip__tx">{children}</span>
    </span>
  );
}
