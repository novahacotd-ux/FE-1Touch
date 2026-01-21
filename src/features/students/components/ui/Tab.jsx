
import React from "react";

export default function Tab({ label, active, onClick }) {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}
