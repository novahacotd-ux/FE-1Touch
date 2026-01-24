
import React from "react";

export default function InfoBox({ label, value }) {
  return (
    <div className="ibox">
      <div className="ibox__label">{label}</div>
      <div className="ibox__value">{value}</div>
    </div>
  );
}
