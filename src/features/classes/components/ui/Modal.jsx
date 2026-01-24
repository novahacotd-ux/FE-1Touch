import React from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ open, title, onClose, children, footer, className = "", style = {} }) {
  if (!open) return null;
  return (
    <div className="clm-modal__backdrop" role="dialog" aria-modal="true">
      <div className={`clm-modal ${className}`} style={style}>
        <div className="clm-modal__hd">
          <div className="clm-modal__ttl">{title}</div>
          <button className="clm-ibtn" title="Đóng" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="clm-modal__bd">{children}</div>
        {footer ? <div className="clm-modal__ft">{footer}</div> : null}
      </div>
    </div>
  );
}
