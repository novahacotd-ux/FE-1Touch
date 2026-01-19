
import React from 'react';
import { FiX } from "react-icons/fi";

export default function Modal({ title, children, onClose, className = "" }) {
  return (
    <div className="at-modalBackdrop" onMouseDown={onClose}>
      <div className={`at-modal ${className}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="at-modal__head">
          <div className="at-modal__title">{title}</div>
          <button className="at-iconBtn" onClick={onClose} aria-label="close">
            <FiX />
          </button>
        </div>
        <div className="at-modal__body">{children}</div>
      </div>
    </div>
  );
}
