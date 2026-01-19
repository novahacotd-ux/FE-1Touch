
import React from 'react';
import { FiX } from "react-icons/fi";

export default function Drawer({ title, children, onClose }) {
  return (
    <div className="at-drawerBackdrop" onMouseDown={onClose}>
      <div className="at-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="at-drawer__head">
          <div>
            <div className="at-drawer__title">{title}</div>
            <div className="at-drawer__sub">Xem 360: account • capability • assignments • audit.</div>
          </div>
          <button className="at-iconBtn" onClick={onClose} aria-label="close">
            <FiX />
          </button>
        </div>
        <div className="at-drawer__body">{children}</div>
      </div>
    </div>
  );
}
