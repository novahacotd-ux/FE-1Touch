
import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";

import Select from "../../../dashboard/admin/components/ui/Select";

export default function AssignModal({ teacherId, teacherRows, subjects, classes, teacherAssignments, onClose, onAdd, onRemove }) {
  const row = teacherRows.find((r) => r.teacher_id === teacherId);

  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [role, setRole] = useState("SUBJECT");

  const assigns = teacherAssignments.filter((a) => a.teacher_id === teacherId);

  // Options
  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.code} — ${s.name}` }));
  const roleOptions = [
    { value: "SUBJECT", label: "SUBJECT (GV bộ môn)" },
    { value: "HOMEROOM", label: "HOMEROOM (GVCN)" }
  ];

  return (
    <Modal onClose={onClose} title={`Phân công giảng dạy • ${row?.full_name || ""}`}>
      <div className="at-assignModal">
        <div className="at-assignForm">
          <label className="at-field">
            <span>Lớp</span>
            <Select 
                value={classId} 
                onChange={(val) => setClassId(val)} 
                options={classOptions} 
                className="at-select"
            />
          </label>

          <label className="at-field">
            <span>Môn</span>
            <Select 
                value={subjectId} 
                onChange={(val) => setSubjectId(val)} 
                options={subjectOptions} 
                className="at-select"
            />
          </label>

          <label className="at-field">
            <span>Vai trò</span>
            <Select 
                value={role} 
                onChange={(val) => setRole(val)} 
                options={roleOptions} 
                className="at-select"
            />
          </label>

          <button
            className="at-btn"
            onClick={() => onAdd({ teacher_id: teacherId, class_id: classId, subject_id: subjectId, role })}
          >
            <FiPlus /> Thêm phân công
          </button>
        </div>

        <div className="at-section">
          <div className="at-section__title">Danh sách phân công hiện tại</div>
          <div className="at-assignList">
            <div className="at-assignList__head">
              <span>Lớp</span><span>Môn</span><span>Vai trò</span><span />
            </div>

            {assigns.length ? (
              assigns.map((a) => {
                const c = classes.find((x) => x.id === a.class_id);
                const s = subjects.find((x) => x.id === a.subject_id);
                return (
                  <div key={a.id} className="at-assignList__row">
                    <span className="at-chip at-chip--green">{c?.name || a.class_id}</span>
                    <span className="at-chip">{s?.code || a.subject_id}</span>
                    <span className={`at-chip ${a.role === "HOMEROOM" ? "at-chip--solid" : "at-chip--ghost"}`}>{a.role}</span>
                    <button className="at-iconBtn at-iconBtn--danger" title="Gỡ" onClick={() => onRemove(a.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="at-muted" style={{ padding: "10px 0" }}>
                Chưa có phân công.
              </div>
            )}
          </div>
        </div>

        <div className="at-modal__actions">
          <button className="at-btn at-btn--ghost" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
