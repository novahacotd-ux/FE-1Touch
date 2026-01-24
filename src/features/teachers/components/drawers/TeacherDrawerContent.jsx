
import React, { useMemo } from 'react';
import { FiEdit2, FiClipboard, FiKey, FiLock, FiUnlock } from "react-icons/fi";
import StatusBadge from "../ui/StatusBadge";

export default function TeacherDrawerContent({ row, subjects, classes, teacherAssignments, auditLogs, onEdit, onAssign, onLockToggle, onResetPw }) {
  const subById = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, s])), [subjects]);
  const classById = useMemo(() => Object.fromEntries(classes.map((c) => [c.id, c])), [classes]);

  const assigns = teacherAssignments
    .filter((a) => a.teacher_id === row.teacher_id)
    .map((a) => ({
      ...a,
      className: classById[a.class_id]?.name || a.class_id,
      subject: subById[a.subject_id]?.code || a.subject_id,
      subjectName: subById[a.subject_id]?.name || "",
    }));

  const logs = auditLogs
    .filter((l) => l.entity_id === row.teacher_id || l.entity_id === row.user_id)
    .slice(0, 8);

  return (
    <div className="at-drawerGrid">
      <div className="at-box">
        <div className="at-box__title">Account</div>
        <div className="at-kv">
          <div className="at-kv__row"><span>Mã GV</span><b className="at-mono">{row.teacher_code}</b></div>
          <div className="at-kv__row"><span>Username</span><b className="at-mono">@{row.username}</b></div>
          <div className="at-kv__row"><span>Email</span><b>{row.email}</b></div>
          <div className="at-kv__row"><span>Phone</span><b>{row.phone}</b></div>
          <div className="at-kv__row"><span>Status</span><StatusBadge status={row.status} /></div>
          <div className="at-kv__row"><span>Created</span><b>{row.created_at}</b></div>
          <div className="at-kv__row"><span>Updated</span><b>{row.updated_at}</b></div>
        </div>

        <div className="at-drawerActions">
          <button className="at-btn at-btn--ghost" onClick={onEdit}><FiEdit2 /> Sửa</button>
          <button className="at-btn at-btn--ghost" onClick={onAssign}><FiClipboard /> Phân công</button>
          <button className="at-btn at-btn--ghost" onClick={onResetPw}><FiKey /> Reset mật khẩu</button>
          <button className="at-btn" onClick={onLockToggle}>
            {row.status === "ACTIVE" ? <><FiLock /> Khóa</> : <><FiUnlock /> Mở khóa</>}
          </button>
        </div>
      </div>

      <div className="at-box">
        <div className="at-box__title">Capability (teacher_subjects)</div>
        <div className="at-chipGrid">
          {row.capability.length ? row.capability.map((s) => (
            <div key={s.id} className="at-chipCard">
              <div className="at-chipCard__code">{s.code}</div>
              <div className="at-chipCard__name">{s.name}</div>
            </div>
          )) : <div className="at-muted">Chưa cấu hình năng lực môn.</div>}
        </div>

        <div className="at-box__title" style={{ marginTop: 14 }}>Assignments (teacher_assignments)</div>
        <div className="at-assignTable">
          <div className="at-assignTable__head">
            <span>Lớp</span><span>Môn</span><span>Vai trò</span>
          </div>
          {assigns.length ? assigns.map((a) => (
            <div key={a.id} className="at-assignTable__row">
              <span className="at-chip at-chip--green">{a.className}</span>
              <span className="at-chip">{a.subject}</span>
              <span className={`at-chip ${a.role === "HOMEROOM" ? "at-chip--solid" : "at-chip--ghost"}`}>{a.role}</span>
            </div>
          )) : <div className="at-muted" style={{ padding: "10px 0" }}>Chưa có phân công.</div>}
        </div>

        <div className="at-summaryRow">
          <div className="at-summaryItem">
            <div className="at-summaryLabel">GVCN</div>
            <div className="at-summaryVal">{row.homerooms.length || 0}</div>
          </div>
          <div className="at-summaryItem">
            <div className="at-summaryLabel">Tổng phân công</div>
            <div className="at-summaryVal">{row.assignmentCount}</div>
          </div>
          <div className="at-summaryItem">
            <div className="at-summaryLabel">Workload</div>
            <div className="at-summaryVal">{row.workload}</div>
          </div>
        </div>
      </div>

      <div className="at-box at-box--span2">
        <div className="at-box__title">Recent audit logs</div>
        <div className="at-audit">
          <div className="at-audit__head">
            <span>Thời gian</span><span>Action</span><span>Entity</span><span>EntityId</span>
          </div>
          {logs.length ? logs.map((l) => (
            <div key={l.id} className="at-audit__row">
              <span className="at-mono">{l.created_at}</span>
              <span className="at-chip at-chip--ghost">{l.action}</span>
              <span className="at-mono">{l.entity}</span>
              <span className="at-mono">{l.entity_id}</span>
            </div>
          )) : <div className="at-muted" style={{ padding: "10px 0" }}>Chưa có audit log liên quan.</div>}
        </div>
      </div>
    </div>
  );
}
