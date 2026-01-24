import React, { useState, useMemo } from "react";
import { FiSearch, FiPlus, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import Chip from "./ui/Chip";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import Modal from "./ui/Modal";
import Select from "../../dashboard/admin/components/ui/Select";
import { normalize } from "../utils/classHelpers";

export default function ClassRoster({ classId, className, students, roles, onUpdateRole, onAddStudent, onRemoveStudent, note, allStudents = [], allClasses = [] }) {
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);


  const nq = normalize(q);

  const list = useMemo(() => {
    return students
      .filter((s) => {
        if (!nq) return true;
        return normalize(s.full_name).includes(nq) || normalize(s.student_code).includes(nq);
      })
      .slice()
      .sort((a, b) => a.student_code.localeCompare(b.student_code));
  }, [students, nq]);

  const summary = useMemo(() => {
    let active = 0, transferred = 0, inactive = 0;
    for (const s of students) {
      if (s.status === "ACTIVE") active++;
      else if (s.status === "TRANSFERRED") transferred++;
      else inactive++;
    }
    return { total: students.length, active, transferred, inactive };
  }, [students]);

  /* New Add Student Logic: Search & Select/Transfer */
  const [activeTab, setActiveTab] = useState("FREE"); // FREE | ASSIGNED
  const [searchQ, setSearchQ] = useState("");

  const searchResults = useMemo(() => {
    const nq = normalize(searchQ);
    return allStudents
      .filter((s) => {
        // Filter by Tab
        if (activeTab === "FREE" && s.class_id) return false;
        if (activeTab === "ASSIGNED" && (!s.class_id || s.class_id === classId)) return false;
        
        // Filter by Search
        if (!searchQ.trim()) return true; // Show all if search is empty (for that tab)
        return normalize(s.full_name).includes(nq) || normalize(s.student_code).includes(nq);
      })
      .slice(0, 10);
  }, [allStudents, searchQ, activeTab, classId]);

  const handleAdd = (studentId) => {
    onAddStudent(classId, studentId);
    setSearchQ("");
    setAddOpen(false);
  };

  return (
    <div className="clm-roster">
      <div className="clm-roster__top">
        <div>
          <div className="clm-roster__ttl">Thành viên lớp {className}</div>
          <div className="clm-roster__sub">
            {note}
          </div>
        </div>

        <div className="clm-roster__meta">
          <Chip tone="good">ACTIVE: {summary.active}</Chip>
          <Chip tone="info">TRANSFER: {summary.transferred}</Chip>
          <Chip tone="neutral">INACTIVE: {summary.inactive}</Chip>
          <Chip tone="neutral">TỔNG: {summary.total}</Chip>
        </div>
      </div>

      <div className="clm-roster__tools">
        <div className="clm-field clm-field--grow">
          <div className="clm-field__lb">
            <FiSearch /> Tìm học sinh trong lớp
          </div>
          <input className="clm-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tên / mã HS..." />
        </div>
        <Button size="sm" leftIcon={<FiPlus />} onClick={() => setAddOpen(true)}>
          Thêm HS
        </Button>
      </div>

      <div className="clm-rosterTable">
        <div className="clm-rtr clm-rtr--head" style={{ gridTemplateColumns: "0.8fr 1.5fr 1.2fr 1fr 60px" }}>
          <div className="clm-rth">Mã</div>
          <div className="clm-rth">Họ tên</div>
          <div className="clm-rth">Chức vụ</div>
          <div className="clm-rth">Trạng thái</div>
          <div className="clm-rth"></div>
        </div>

        {list.map((s) => (
          <div key={s.id} className="clm-rtr" style={{ gridTemplateColumns: "0.8fr 1.5fr 1.2fr 1fr 60px" }}>
            <div className="clm-rtd">{s.student_code}</div>
            <div className="clm-rtd">{s.full_name}</div>
            <div className="clm-rtd">
              <Select
                value={s.student_role_id}
                onChange={(val) => onUpdateRole(s.id, val)}
                options={roles.map((r) => ({ value: r.id, label: r.role_name }))}
                className="clm-select--sm"
              />
            </div>
            <div className="clm-rtd">
              {s.status === "ACTIVE" ? (
                <Chip tone="good">ACTIVE</Chip>
              ) : s.status === "TRANSFERRED" ? (
                <Chip tone="info">TRANSFERRED</Chip>
              ) : (
                <Chip tone="warn">INACTIVE</Chip>
              )}
            </div>
            <div className="clm-rtd" style={{ display: "flex", justifyContent: "center" }}>
              <IconButton title="Xóa khỏi lớp" onClick={() => onRemoveStudent(s.id)}>
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        {list.length === 0 ? (
          <div className="clm-empty" style={{ marginTop: 10 }}>
            <div className="clm-empty__ttl">Không tìm thấy học sinh in class</div>
            <div className="clm-empty__sub">Hãy thử từ khóa khác hoặc thêm mới.</div>
          </div>
        ) : null}
      </div>

      <Modal
        open={addOpen}
        title={`Thêm học sinh vào lớp ${className}`}
        onClose={() => setAddOpen(false)}
        footer={null} // Custom footer or no footer needed as we have inline actions
      >
        <div className="clm-form">
          <div className="clm-tabs" style={{ display: "flex", gap: 0, background: "var(--second-bg)", borderRadius: 8, padding: 4, border: "1px solid var(--border)" }}>
            <button
              onClick={() => setActiveTab("FREE")}
              style={{
                flex: 1, padding: "8px 12px", border: "none", background: activeTab === "FREE" ? "var(--card-bg)" : "transparent",
                color: activeTab === "FREE" ? "var(--mc)" : "var(--ts)", fontWeight: 700, borderRadius: 6, cursor: "pointer",
                boxShadow: activeTab === "FREE" ? "0 2px 5px rgba(0,0,0,0.05)" : "none", transition: "all .15s"
              }}
            >
              Chưa có lớp
            </button>
            <button
              onClick={() => setActiveTab("ASSIGNED")}
              style={{
                flex: 1, padding: "8px 12px", border: "none", background: activeTab === "ASSIGNED" ? "var(--card-bg)" : "transparent",
                color: activeTab === "ASSIGNED" ? "var(--mc)" : "var(--ts)", fontWeight: 700, borderRadius: 6, cursor: "pointer",
                boxShadow: activeTab === "ASSIGNED" ? "0 2px 5px rgba(0,0,0,0.05)" : "none", transition: "all .15s"
              }}
            >
              Đã có lớp (Chuyển)
            </button>
          </div>

          <div className="clm-field">
            <div className="clm-field__lb">Tìm học sinh</div>
            <input
              className="clm-input"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={activeTab === "FREE" ? "Tìm HS tự do..." : "Tìm HS từ lớp khác..."}
              autoFocus
            />
            {searchQ && <div className="clm-help">Tìm thấy {searchResults.length} học sinh</div>}
          </div>

          <div className="clm-wizList">
            {searchResults.map(s => {
              const currentClass = allClasses.find(c => c.id === s.class_id);
              return (
                <div key={s.id} className="clm-wizItem" onClick={() => handleAdd(s.id)}>
                  <div className="clm-wizItem__main" style={{ flex: 1 }}>
                    <div className="clm-wizItem__name">{s.full_name} ({s.student_code})</div>
                    <div className="clm-wizItem__meta">
                      {currentClass ? `Đang ở lớp: ${currentClass.class_name}` : "Chưa có lớp (Tự do)"}
                    </div>
                  </div>
                  <Button size="sm" variant={currentClass ? "secondary" : "primary"}>
                    {currentClass ? "Chuyển đến đây" : "Thêm vào lớp"}
                  </Button>
                </div>
              );
            })}
            
            {searchResults.length === 0 && (
               <div className="clm-empty">
                 <div className="clm-empty__sub">
                   {activeTab === "FREE" ? "Không có học sinh nào chưa có lớp." : "Không tìm thấy học sinh phù hợp."}
                 </div>
               </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
