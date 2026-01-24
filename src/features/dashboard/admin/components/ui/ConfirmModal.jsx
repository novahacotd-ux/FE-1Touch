import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title={title} className="modal--confirm">
      <div className="confirmDesc">{description}</div>
      <div className="modalActions">
        <button className="btn btn--ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </button>
        <button className="btn btn--primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
