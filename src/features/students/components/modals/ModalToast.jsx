
import React from "react";
import { FiX } from "react-icons/fi";

export default function ModalToast({ modal, onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="strong">{modal.payload?.title || "Thông báo"}</div>
          <button className="iconBtn" onClick={onClose}><FiX /></button>
        </div>
        <div className="muted">{modal.payload?.desc}</div>
        <div className="modalActions">
          <button className="btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
