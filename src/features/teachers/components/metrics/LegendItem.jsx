
import React from 'react';

export default function LegendItem({ label, value }) {
  return (
    <div className="at-legendItem">
      <span className="at-legendDot" />
      <span className="at-legendText">{label}</span>
      <span className="at-legendVal">{value}</span>
    </div>
  );
}
