
import React from 'react';

export default function StatusBadge({ status }) {
  const cls = status === "ACTIVE" ? "at-badge at-badge--ok" : "at-badge at-badge--warn";
  return <span className={cls}>{status}</span>;
}
