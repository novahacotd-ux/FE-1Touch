
import React, { useState } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";
import { MOCK_RECORDS } from "../../data/mockData";
import Select from "../../../dashboard/admin/components/ui/Select";

export default function ModalOverrideAttendance({ modal, onClose, onAudit, onMutate }) {
  const recordId = modal.payload?.recordId;
  const record = MOCK_RECORDS.find((r) => r.id === recordId);

  const [status, setStatus] = useState(record?.status || "PRESENT");
  const [note, setNote] = useState(record?.note || "");

  const STATUS_OPTS = [
    { value: "PRESENT", label: "PRESENT" },
    { value: "LATE", label: "LATE" },
    { value: "ABSENT_EXCUSED", label: "ABSENT_EXCUSED" },
    { value: "ABSENT_UNEXCUSED", label: "ABSENT_UNEXCUSED" },
  ];

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="strong">Override điểm danh</div>
          <button className="iconBtn" onClick={onClose}><FiX /></button>
        </div>

        <div className="muted">
          Chỉnh status/note cho record. Sau khi lưu, danh sách sẽ cập nhật ngay (mock).
        </div>

        <div className="formRow">
          <label>Status</label>
          <Select 
            value={status} 
            onChange={setStatus} 
            options={STATUS_OPTS} 
          />
        </div>


        <div className="formRow">
          <label>Note</label>
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Lý do/ghi chú…"
          />
        </div>

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>Huỷ</button>
          <button
            className="btn"
            onClick={() => {
              onMutate.overrideRecord({ recordId, status, note });
              onAudit("OVERRIDE_ATTENDANCE", "attendance_records", recordId);
              onClose();
            }}
          >
            <FiEdit2 /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
