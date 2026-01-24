import React from "react";
import { FiX } from "react-icons/fi";

export default function ToastHost({ toasts, removeToast }) {
  return (
    <div className="clm-toastHost" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`clm-toast clm-toast--${t.type || "info"}`}>
          <div className="clm-toast__msg">{t.message}</div>
          <button className="clm-toast__x" onClick={() => removeToast(t.id)} aria-label="Close toast">
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
}
