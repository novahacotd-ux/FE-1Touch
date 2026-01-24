
import React from 'react';

export default function Metric({ label, value, icon, variant = 'default' }) {
  return (
    <div className="at-metric">
      <div className={`at-metric__icon at-metric__icon--${variant}`}>{icon}</div>
      <div className="at-metric__body">
        <div className="at-metric__label">{label}</div>
        <div className="at-metric__value">{value}</div>
      </div>
    </div>
  );
}
