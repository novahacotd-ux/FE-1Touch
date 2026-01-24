import React from 'react';
import { FiX } from "react-icons/fi";

export default function Modal({ title, children, onClose, className = "" }) {
  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className={`modal ${className}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="modalTitle">{title}</div>
          <button className="modalClose" onClick={onClose} aria-label="close">
            <FiX />
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
