
import React, { useMemo, useState, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiUserPlus,
  FiDownload,
  FiRefreshCw,
  FiAlertTriangle,
  FiLink2,
  FiUsers,
  FiCalendar,
  FiShield,
  FiClock,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiBell,
  FiX,
} from "react-icons/fi";

// Data
import { 
  MOCK_USERS, MOCK_CLASSES, MOCK_STUDENTS, MOCK_PARENTS, 
  MOCK_SESSIONS, MOCK_RECORDS, MOCK_LOGS, MOCK_NOTIFICATIONS 
} from "../data/mockData";

// Utils
import { 
  getClassName, dateOnly, uid, uidUser, 
  computeLastIn, computeAttendanceSummary 
} from "../utils/helpers";
import "../styles/AdminStudents.css";

// UI Components (Global/Feature)
import Select from "../../dashboard/admin/components/ui/Select";
import Checkbox from "../../dashboard/admin/components/ui/Checkbox";
import Card from "../../dashboard/admin/components/ui/Card";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import Pagination from "../../dashboard/admin/components/ui/Pagination";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

// Local Components
import Tab from "../components/ui/Tab";
import DonutActionable from "../components/ui/DonutActionable";

// Panels
import OverviewPanel from "../components/panels/OverviewPanel";
import FingerprintPanel from "../components/panels/FingerprintPanel";
import AttendancePanel from "../components/panels/AttendancePanel";
import ParentsPanel from "../components/panels/ParentsPanel";
import NotificationsPanel from "../components/panels/NotificationsPanel";
import AuditPanel from "../components/panels/AuditPanel";

// Modals
import ModalHost from "../components/modals/ModalHost";

// Options for Selects
const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "TRANSFERRED", label: "TRANSFERRED" },
  { value: "INACTIVE", label: "INACTIVE" },
];

const FP_OPTIONS = [
  { value: "ALL", label: "Fingerprint: All" },
  { value: "MISSING", label: "MISSING" },
  { value: "ASSIGNED", label: "ASSIGNED" },
  { value: "DUPLICATE", label: "DUPLICATE" },
];

const RISK_OPTIONS = [
  { value: "ALL", label: "Risk: All" },
  { value: "HIGH_ABSENT", label: "HIGH_ABSENT" },
  { value: "HIGH_LATE", label: "HIGH_LATE" },
  { value: "NO_LOGS", label: "NO_LOGS" },
];

const PARENT_OPTIONS = [
  { value: "ALL", label: "Phụ huynh: All" },
  { value: "NO_PARENT", label: "NO_PARENT" },
  { value: "MISSING_CONTACT", label: "MISSING_CONTACT" },
];

const DAY_OPTIONS = [
  { value: 7, label: "7 ngày" },
  { value: 14, label: "14 ngày" },
  { value: 30, label: "30 ngày" },
];

export default function AdminStudents() {

  const [auditLogs, setAuditLogs] = useState([
    { id: "a1", user_id: "admin", action: "BIND_FINGERPRINT", entity: "students", entity_id: "s1", created_at: "2026-01-15 10:10" },
    { id: "a2", user_id: "admin", action: "OVERRIDE_ATTENDANCE", entity: "attendance_records", entity_id: "r6", created_at: "2026-01-16 11:05" },
  ]);

  // Helpers
  const fingerprintIndex = useMemo(() => {
    const map = new Map(); // fp -> [studentIds]
    MOCK_STUDENTS.forEach((s) => {
      const fp = (s.fingerprint_id || "").trim();
      if (!fp) return;
      if (!map.has(fp)) map.set(fp, []);
      map.get(fp).push(s.id);
    });
    return map;
  }, []);

  const getFingerprintState = useCallback((student) => {
    const fp = (student.fingerprint_id || "").trim();
    if (!fp) return "MISSING";
    const owners = fingerprintIndex.get(fp) || [];
    if (owners.length > 1) return "DUPLICATE";
    return "ASSIGNED";
  }, [fingerprintIndex]);

  const computeRiskTags = useCallback((student) => {
    const tags = [];
    const fpState = getFingerprintState(student);
    if (fpState === "MISSING") tags.push({ key: "FP_MISSING", label: "Thiếu vân tay", tone: "warn" });
    if (fpState === "DUPLICATE") tags.push({ key: "FP_DUP", label: "Trùng vân tay", tone: "danger" });

    const parents = MOCK_PARENTS.filter((p) => p.student_id === student.id);
    if (!parents.length) {
      tags.push({ key: "NO_PARENT", label: "Chưa có phụ huynh", tone: "warn" });
    } else {
      const primary = parents.find((p) => p.is_primary) || parents[0];

      // thiếu contact
      if (!primary?.phone || !primary?.zalo_id)
        tags.push({ key: "PARENT_MISSING_CONTACT", label: "Thiếu liên hệ", tone: "warn" });

      // thiếu tài khoản
      if (!primary?.user_id)
        tags.push({ key: "PARENT_NO_ACCOUNT", label: "PH chưa có tài khoản", tone: "warn" });

      // tài khoản bị khóa
      if (primary?.user_id) {
        const u = MOCK_USERS.find((x) => x.id === primary.user_id);
        if (u?.status === "LOCKED")
          tags.push({ key: "PARENT_LOCKED", label: "Tài khoản PH bị khoá", tone: "danger" });
      }
    }

    const lastIn = computeLastIn(student.id);
    if (!lastIn) tags.push({ key: "NO_LOGS", label: "Không có log IN", tone: "muted" });

    const a7 = computeAttendanceSummary(student.id, 7);
    // thresholds "vận hành" (mock): >=30% absent hoặc >=25% late là risk
    if (a7.total >= 4 && a7.absentRate >= 0.3) tags.push({ key: "HIGH_ABSENT", label: "Vắng nhiều (7d)", tone: "danger" });
    if (a7.total >= 4 && a7.lateRate >= 0.25) tags.push({ key: "HIGH_LATE", label: "Trễ nhiều (7d)", tone: "warn" });

    const notif = MOCK_NOTIFICATIONS.filter((n) => n.student_id === student.id);
    const failed = notif.filter((n) => n.status === "FAILED").length;
    if (failed) tags.push({ key: "NOTIF_FAIL", label: `Zalo fail (${failed})`, tone: "warn" });

    return tags;
  }, [getFingerprintState]);

  // UI State
  const [q, setQ] = useState("");
  const [chkMissingFP, setChkMissingFP] = useState(false);
  const [chkNoParent, setChkNoParent] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ALL"); // ACTIVE/TRANSFERRED/INACTIVE
  const [fpFilter, setFpFilter] = useState("ALL"); // MISSING/ASSIGNED/DUPLICATE
  const [riskFilter, setRiskFilter] = useState("ALL"); // HIGH_ABSENT/HIGH_LATE/NO_LOGS
  const [parentFilter, setParentFilter] = useState("ALL"); // NO_PARENT/MISSING_CONTACT
  const [rangeDays, setRangeDays] = useState(7);

  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => MOCK_STUDENTS.find((s) => s.id === selectedId) || null,
    [selectedId]
  );

  // modals/drawers
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState("overview"); // overview/fingerprint/attendance/parents/notifications/audit

  const [modal, setModal] = useState({ open: false, type: "", payload: null });
  const [confirm, setConfirm] = useState(null);

  const openStudent = (id, tab = "overview") => {
    setSelectedId(id);
    setDrawerTab(tab);
    setShowDrawer(true);
  };

  // Filtering
  const filteredStudents = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().trim();
    const nq = norm(q);

    return MOCK_STUDENTS.filter((s) => {
      const matchesQ =
        !nq ||
        norm(s.full_name).includes(nq) ||
        norm(s.student_code).includes(nq) ||
        norm(s.fingerprint_id).includes(nq) ||
        norm(getClassName(s.class_id)).includes(nq);

      const matchesStatus = statusFilter === "ALL" ? true : s.status === statusFilter;

      const fpState = getFingerprintState(s);
      const matchesFp = fpFilter === "ALL" ? true : fpState === fpFilter;

      const tags = computeRiskTags(s);
      const hasRisk = (k) => tags.some((t) => t.key === k);
      const matchesRisk = riskFilter === "ALL" ? true : hasRisk(riskFilter);

      const parents = MOCK_PARENTS.filter((p) => p.student_id === s.id);
      const primary = parents.find((p) => p.is_primary) || parents[0];
      const matchesParent =
        parentFilter === "ALL"
          ? true
          : parentFilter === "NO_PARENT"
          ? parents.length === 0
          : parentFilter === "MISSING_CONTACT"
          ? !!parents.length && (!primary?.phone || !primary?.zalo_id)
          : true;

      // Quick checkboxes
      if (chkMissingFP && fpState !== "MISSING") return false;
      if (chkNoParent && parents.length > 0) return false;

      return matchesQ && matchesStatus && matchesFp && matchesRisk && matchesParent;
    });
  }, [q, chkMissingFP, chkNoParent, statusFilter, fpFilter, riskFilter, parentFilter, getFingerprintState, computeRiskTags]);

  // Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const resetPage = (val, setter) => {
    setter(val);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const pagedStudents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStudents, page]);

  // Action stubs (write audit log)
  const pushAudit = (action, entity, entityId) => {
    const ts = "2026-01-17 12:00"; // mock now
    setAuditLogs((prev) => [
      { id: uid(), user_id: "admin", action, entity, entity_id: entityId, created_at: ts },
      ...prev,
    ]);
  };

  const handleBindFingerprint = (studentId) => {
    // demo: open modal to input fingerprint
    setModal({ open: true, type: "bindFingerprint", payload: { studentId } });
  };

  // USERS (ERD: users)
  const getUserById = (id) => MOCK_USERS.find((u) => u.id === id) || null;

  const findUserByUsername = (username) =>
    MOCK_USERS.find((u) => u.username.toLowerCase() === (username || "").toLowerCase()) || null;

  // Fake bump to trigger re-render if needed (or just rely on react state for now if not present)
  // I will add a simple integer state `version` to trigger re-renders.
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  // Mock mutation handlers
  const onMutate = useMemo(() => ({
    getUserById, // Export for use in panels
    findUserByUsername,

    setStudentFingerprint: (studentId, fp) => {
      console.log(`[MOCK] Set fingerprint for ${studentId} to ${fp}`);
      const s = MOCK_STUDENTS.find(x => x.id === studentId);
      if (s) s.fingerprint_id = fp;
      bump();
    },
    overrideRecord: ({ recordId, status, note }) => {
      console.log(`[MOCK] Override record ${recordId} -> ${status}, ${note}`);
      const r = MOCK_RECORDS.find(x => x.id === recordId);
      if (r) {
        r.status = status;
        r.note = note;
        bump();
      }
    },
    upsertStudent: (data) => {
      console.log(`[MOCK] Upsert student`, data);
      if (data.id) {
         // update
         const idx = MOCK_STUDENTS.findIndex(s => s.id === data.id);
         if (idx >= 0) MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...data };
         bump();
         return data.id;
      } else {
         // insert
         const newId = `s_new_${Date.now()}`;
         MOCK_STUDENTS.push({ ...data, id: newId });
         bump();
         return newId;
      }
    },
    upsertUser: (data) => {
      // data: {id?, username, password?, full_name, email, phone, role, status, login_method}
      const ts = new Date().toISOString(); // simple timestamp mock

      if (data.id) {
        const idx = MOCK_USERS.findIndex((u) => u.id === data.id);
        if (idx >= 0) {
          MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data, updated_at: ts };
          bump();
          return data.id;
        }
      }

      // create
      const newId = uidUser();
      MOCK_USERS.push({
        id: newId,
        username: data.username,
        password: data.password || "", // mock
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "PARENT",
        status: data.status || "ACTIVE",
        login_method: data.login_method || "PASSWORD",
        created_at: ts,
        updated_at: ts,
      });

      bump();
      return newId;
    },
    setUserStatus: (userId, status) => {
      const ts = new Date().toISOString();
      const idx = MOCK_USERS.findIndex((u) => u.id === userId);
      if (idx >= 0) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], status, updated_at: ts };
        bump();
      }
    },
    resetUserPassword: (userId) => {
      // tạo mật khẩu tạm và lưu vào user.password (mock)
      const ts = new Date().toISOString();
      const temp = `Temp${Math.random().toString(36).slice(2, 8)}!`;
      const idx = MOCK_USERS.findIndex((u) => u.id === userId);
      if (idx >= 0) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], password: temp, login_method: "PASSWORD", updated_at: ts };
        bump();
        return temp;
      }
      return null;
    },
    upsertParent: ({ studentId, parentId, data }) => {
       console.log(`[MOCK] Upsert parent for ${studentId}`, parentId, data);
       
       let finalId = parentId;
       
       if (parentId) {
         const idx = MOCK_PARENTS.findIndex(p => p.id === parentId);
         if (idx >= 0) MOCK_PARENTS[idx] = { ...MOCK_PARENTS[idx], ...data, student_id: studentId };
       } else {
         const newId = `p${MOCK_PARENTS.length + 1}_${Date.now()}`;
         MOCK_PARENTS.push({
           id: newId,
           user_id: data.user_id ?? null,
           student_id: studentId,
           full_name: data.full_name?.trim() || "Phụ huynh mới",
           phone: data.phone?.trim() || "",
           zalo_id: data.zalo_id?.trim() || "",
           is_primary: !!data.is_primary,
         });
         finalId = newId;
       }

        // nếu set PRIMARY => unset PRIMARY của các parent khác cùng student
        if (data.is_primary) {
          MOCK_PARENTS.forEach((p) => {
            if (p.student_id === studentId && p.id !== finalId) p.is_primary = false;
          });
        }
        
        bump();
        return finalId;
    }
  }), []);

  const handleUnbindFingerprint = (studentId) => {
    setConfirm({
      title: "Gỡ vân tay?",
      description: "Vân tay của học sinh sẽ bị xoá khỏi hệ thống mapping.",
      confirmLabel: "Gỡ vân tay",
      onConfirm: () => {
        pushAudit("UNBIND_FINGERPRINT", "students", studentId);
        setConfirm(null);
      }
    });
  };

  const handleOverrideRecord = (recordId) => {
    setModal({ open: true, type: "overrideAttendance", payload: { recordId } });
  };

  const handleResendNotification = (notifId) => {
    pushAudit("RESEND_NOTIFICATION", "notifications", notifId);
    setModal({ open: true, type: "toast", payload: { title: "Đã gửi lại (mock)", desc: "Lệnh resend đã được ghi audit để truy vết." } });
  };

  const handleEditStudent = (studentId) => {
    setModal({ open: true, type: "editStudent", payload: { studentId } });
  };

  const handleAddStudent = () => {
    setModal({ open: true, type: "addStudent", payload: {} });
  };

  const handleDeleteStudent = (studentId) => {
    setConfirm({
      title: "Xoá học sinh?",
      description: "Khuyến nghị chuyển trạng thái INACTIVE thay vì xoá cứng để giữ lịch sử điểm danh.",
      confirmLabel: "Xoá",
      onConfirm: () => {
        pushAudit("DELETE_STUDENT", "students", studentId);
        setConfirm(null);
      },
    });
  };

  // ===== Top “Operational Queue” (not duplicate: focuses on action) =====
  const operationalQueue = useMemo(() => {
    version; // trigger update
    const rows = MOCK_STUDENTS
      .map((s) => {
        const tags = computeRiskTags(s);
        const severity =
          tags.some((t) => t.tone === "danger") ? 2 : tags.some((t) => t.tone === "warn") ? 1 : 0;
        return { s, tags, severity };
      })
      .filter((x) => x.tags.length > 0)
      .sort((a, b) => b.severity - a.severity || b.tags.length - a.tags.length);

    return rows.slice(0, 8);
  }, [version, computeRiskTags]); // depend on version to refresh

  const issueDonut = useMemo(() => {
    version;
    const counts = { FP_MISSING: 0, FP_DUP: 0, NO_PARENT: 0, HIGH_ABSENT: 0 };
    MOCK_STUDENTS.forEach((s) => {
      const tags = computeRiskTags(s);
      const has = (k) => tags.some((t) => t.key === k);
      if (has("FP_MISSING")) counts.FP_MISSING++;
      if (has("FP_DUP")) counts.FP_DUP++;
      if (has("NO_PARENT")) counts.NO_PARENT++;
      if (has("HIGH_ABSENT")) counts.HIGH_ABSENT++;
    });

    return [
      { key: "FP_DUP", label: "Trùng vân tay", value: counts.FP_DUP, color: "rgba(239,68,68,.9)" },
      { key: "FP_MISSING", label: "Thiếu vân tay", value: counts.FP_MISSING, color: "rgba(245,158,11,.95)" },
      { key: "NO_PARENT", label: "Chưa có PH", value: counts.NO_PARENT, color: "rgba(99,102,241,.65)" },
      { key: "HIGH_ABSENT", label: "Vắng nhiều", value: counts.HIGH_ABSENT, color: "var(--mc)" },
    ].filter((x) => x.value > 0);
  }, [computeRiskTags, version]);

  // Render
  return (
    <div className="stu-page">


      {/* Toolbar */}
      <div className="stu-toolbar">
         <div className="stu-toolbar__left">
            <div className="strong" style={{fontSize: '1.1rem'}}>Quản lý học sinh</div>
         </div>
         <div className="stu-toolbar__right">
          <button className="btn" onClick={handleAddStudent}>
            <FiUserPlus /> Thêm học sinh
          </button>
          <button className="btn btn-ghost" onClick={() => setModal({ open: true, type: "toast", payload: { title: "Export (mock)", desc: "Xuất Excel danh sách + trạng thái vân tay + thống kê điểm danh." } })}>
            <FiDownload /> Export Excel
          </button>
        </div>
      </div>

      {/* Top panels: operational (actionable) + issue donut */}
      <div className="stu-gridTop">
        <Card
          icon={<FiAlertTriangle />}
          title="Hàng đợi vận hành"
          subtitle="Nhìn vào để xử lý: vân tay / phụ huynh / điểm danh bất thường"
          right={
            <button className="btn btn-ghost" onClick={() => setModal({ open: true, type: "toast", payload: { title: "Refresh (mock)", desc: "nút này sẽ refetch danh sách + logs + records." } })}>
              <FiRefreshCw /> Refresh
            </button>
          }
        >
          <div className="queue">
            {operationalQueue.map(({ s, tags }) => {
              const fpState = getFingerprintState(s);
              return (
                <div key={s.id} className="queueRow" onClick={() => openStudent(s.id, fpState !== "ASSIGNED" ? "fingerprint" : "attendance")}>
                  <div className="queueRow__main">
                    <div className="queueRow__title">
                      <span className="strong">{s.full_name}</span>
                      <span className="muted">• {s.student_code}</span>
                      <span className="muted">• Lớp {getClassName(s.class_id)}</span>
                    </div>
                    <div className="tagRow">
                      {tags.slice(0, 4).map((t) => (
                        <span key={t.key} className={`tag tag--${t.tone}`}>{t.label}</span>
                      ))}
                    </div>
                  </div>

                  <div className="queueRow__actions" onClick={(e) => e.stopPropagation()}>
                    {getFingerprintState(s) === "MISSING" ? (
                      <button className="btn btn-sm" onClick={() => handleBindFingerprint(s.id)}>
                        <FiLink2 /> Gán vân tay
                      </button>
                    ) : null}
                    {tags.some((t) => t.key === "HIGH_ABSENT" || t.key === "HIGH_LATE") ? (
                      <button className="btn btn-sm btn-ghost" onClick={() => openStudent(s.id, "attendance")}>
                        <FiClock /> Xem điểm danh
                      </button>
                    ) : null}
                    <button className="btn btn-sm btn-ghost" onClick={() => openStudent(s.id, "overview")}>
                      <FiChevronRight /> Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
            {!operationalQueue.length ? <div className="empty">Không có vấn đề nổi bật.</div> : null}
          </div>
        </Card>

        <Card
          icon={<FiShield />}
          title="Phân bố vấn đề chính"
          subtitle="Chọn để lọc các học sinh có vấn đề"
        >
          <DonutActionable
            items={issueDonut.length ? issueDonut : [{ key: "ok", label: "Không có issue", value: 1, color: "var(--mc)" }]}
            centerTop={issueDonut.reduce((s, x) => s + x.value, 0)}
            centerBottom="Issue"
            onItemClick={(it) => {
              // quick filter
              if (it.key === "FP_MISSING") setFpFilter("MISSING");
              if (it.key === "FP_DUP") setFpFilter("DUPLICATE");
              if (it.key === "NO_PARENT") setParentFilter("NO_PARENT");
              if (it.key === "HIGH_ABSENT") setRiskFilter("HIGH_ABSENT");
            }}
          />

          <div className="hint">
            Click vào từng phần để lọc danh sách bên dưới (Fingerprint / Parent / Attendance risk).
          </div>
        </Card>
      </div>

       {/* Filter Panel */}
      <Card
        icon={<FiFilter />}
        title="Bộ lọc & Tìm kiếm"
        subtitle="Lọc danh sách học sinh bên dưới"
      >
        <div className="stu-toolbar" style={{border: 'none', padding: 0}}>
          <div className="stu-toolbar__left" style={{flexWrap: 'wrap', width: '100%', gap: '16px'}}>
            
            {/* Search & Checkboxes Row */}
            <div style={{ display: "flex", width: "100%", gap: "16px", alignItems: "center" }}>
              <SearchInput 
                value={q} 
                onChange={(v) => resetPage(v, setQ)} 
                placeholder="Tìm theo mã HS, tên, vân tay, lớp (read-only)…"
                className=""
                label={null}
                style={{ flex: 1, minWidth: "200px" }}
              />

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
                <Checkbox 
                  checked={chkMissingFP} 
                  onChange={(e) => resetPage(e.target.checked, setChkMissingFP)} 
                  label="Thiếu vân tay" 
                />
                <Checkbox 
                  checked={chkNoParent} 
                  onChange={(e) => resetPage(e.target.checked, setChkNoParent)} 
                  label="Chưa có phụ huynh" 
                />
              </div>
            </div>

            {/* Select Filters Row */}
            <div className="stu-filters">
              <div className="stu-filter">
                <FiFilter className="text-muted" />
                <Select 
                  value={statusFilter} 
                  onChange={(v) => resetPage(v, setStatusFilter)} 
                  options={STATUS_OPTIONS} 
                />
              </div>

              <div className="stu-filter">
                <FiLink2 className="text-muted" />
                <Select 
                  value={fpFilter} 
                  onChange={(v) => resetPage(v, setFpFilter)} 
                  options={FP_OPTIONS} 
                />
              </div>

              <div className="stu-filter">
                <FiShield className="text-muted" />
                <Select 
                  value={riskFilter} 
                  onChange={(v) => resetPage(v, setRiskFilter)} 
                  options={RISK_OPTIONS} 
                />
              </div>

              <div className="stu-filter">
                <FiUsers className="text-muted" />
                <Select 
                  value={parentFilter} 
                  onChange={(v) => resetPage(v, setParentFilter)} 
                  options={PARENT_OPTIONS} 
                />
              </div>

              <div className="stu-filter">
                <FiCalendar className="text-muted" />
                <Select 
                  value={rangeDays} 
                  onChange={(v) => setRangeDays(parseInt(v, 10))} 
                  options={DAY_OPTIONS} 
                />
              </div>
            </div>

          </div>
        </div>
      </Card>

      {/* Main table */}
      <Card
        icon={<FiUsers />}
        title={`Danh sách học sinh (${filteredStudents.length})`}
        subtitle="Chọn 1 học sinh để xem vân tay, log IN/OUT, record điểm danh, phụ huynh và notifications"
      >
        <div className="tableWrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Mã</th>
                <th>Lớp (read-only)</th>
                <th>Fingerprint</th>
                <th>Last IN</th>
                <th>Điểm danh ({rangeDays}d)</th>
                <th>Risk</th>
                <th>PH</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedStudents.map((s) => {
                const fpState = getFingerprintState(s);
                const lastIn = computeLastIn(s.id);
                const a = computeAttendanceSummary(s.id, rangeDays);
                const tags = computeRiskTags(s);
                const parents = MOCK_PARENTS.filter((p) => p.student_id === s.id);

                return (
                  <tr key={s.id} onClick={() => openStudent(s.id, "overview")}>
                    <td>
                      <div className="cellMain">
                        <div className="strong">{s.full_name}</div>
                        <div className="muted">{s.status}</div>
                      </div>
                    </td>
                    <td className="mono">{s.student_code}</td>
                    <td>{getClassName(s.class_id)}</td>
                    <td>
                      <span className={`pill pill--${fpState.toLowerCase()}`}>
                        {fpState}
                      </span>
                      <div className="muted mono">{(s.fingerprint_id || "").trim() || "—"}</div>
                    </td>
                    <td className="mono">{lastIn ? `${dateOnly(lastIn)} ${String(lastIn.getHours()).padStart(2, "0")}:${String(lastIn.getMinutes()).padStart(2, "0")}` : "—"}</td>
                    <td className="mono">
                      P:{a.PRESENT} • L:{a.LATE} • A:{a.ABSENT_EXCUSED + a.ABSENT_UNEXCUSED}
                    </td>
                    <td>
                      <div className="tagRow">
                        {tags.slice(0, 2).map((t) => (
                          <span key={t.key} className={`tag tag--${t.tone}`}>{t.label}</span>
                        ))}
                        {tags.length > 2 ? <span className="muted">+{tags.length - 2}</span> : null}
                      </div>
                    </td>
                    <td>
                      {parents.length ? (
                        <span className="pill pill--ok">
                          <FiCheckCircle /> {parents.length} PH
                        </span>
                      ) : (
                        <span className="pill pill--warn">
                          <FiAlertTriangle /> 0 PH
                        </span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                      <div className="rowBtns">
                        <button className="iconBtn accent" title="Gán vân tay" onClick={() => handleBindFingerprint(s.id)}>
                          <FiLink2 />
                        </button>
                        <button className="iconBtn warn" title="Xem điểm danh" onClick={() => openStudent(s.id, "attendance")}>
                          <FiClock />
                        </button>
                        <button className="iconBtn info" title="Phụ huynh" onClick={() => openStudent(s.id, "parents")}>
                          <FiUsers />
                        </button>
                        <button className="iconBtn success" title="Sửa" onClick={() => handleEditStudent(s.id)}>
                          <FiEdit2 />
                        </button>
                        <button className="iconBtn danger" title="Xoá" onClick={() => handleDeleteStudent(s.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!pagedStudents.length ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty">Không có dữ liệu phù hợp bộ lọc.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Pagination Shared Component */}
        <div style={{ padding: "14px", borderTop: "1px solid var(--border)" }}>
           <Pagination 
             page={page} 
             totalPages={totalPages} 
             onPageChange={setPage} 
           />
        </div>
      </Card>

      {/* Drawer */}
      {showDrawer && selected ? (
        <div className="drawerOverlay" onClick={() => setShowDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawerHead">
              <div className="drawerTitle">
                <div className="strong">{selected.full_name}</div>
                <div className="muted">
                  {selected.student_code} • Lớp {getClassName(selected.class_id)} (read-only)
                </div>
              </div>
              <button className="iconBtn" onClick={() => setShowDrawer(false)} aria-label="Close">
                <FiX />
              </button>
            </div>

            <div className="drawerTabs">
              <Tab label="Tổng quan" active={drawerTab === "overview"} onClick={() => setDrawerTab("overview")} />
              <Tab label="Vân tay" active={drawerTab === "fingerprint"} onClick={() => setDrawerTab("fingerprint")} />
              <Tab label="Điểm danh" active={drawerTab === "attendance"} onClick={() => setDrawerTab("attendance")} />
              <Tab label="Phụ huynh" active={drawerTab === "parents"} onClick={() => setDrawerTab("parents")} />
              <Tab label="Thông báo" active={drawerTab === "notifications"} onClick={() => setDrawerTab("notifications")} />
              <Tab label="Audit" active={drawerTab === "audit"} onClick={() => setDrawerTab("audit")} />
            </div>

            <div className="drawerBody">
              {drawerTab === "overview" ? (
                <OverviewPanel
                  student={selected}
                  className={getClassName(selected.class_id)}
                  fpState={getFingerprintState(selected)}
                  tags={computeRiskTags(selected)}
                  onBind={() => handleBindFingerprint(selected.id)}
                  onUnbind={() => handleUnbindFingerprint(selected.id)}
                />
              ) : null}

              {drawerTab === "fingerprint" ? (
                <FingerprintPanel
                  student={selected}
                  fpState={getFingerprintState(selected)}
                  fingerprintIndex={fingerprintIndex}
                  logs={MOCK_LOGS.filter((l) => l.student_id === selected.id).slice(0, 20)}
                  onBind={() => handleBindFingerprint(selected.id)}
                  onUnbind={() => handleUnbindFingerprint(selected.id)}
                />
              ) : null}

              {drawerTab === "attendance" ? (
                <AttendancePanel
                  student={selected}
                  rangeDays={rangeDays}
                  sessions={MOCK_SESSIONS}
                  records={MOCK_RECORDS.filter((r) => r.student_id === selected.id)}
                  onOverride={handleOverrideRecord}
                />
              ) : null}

              {drawerTab === "parents" ? (
                <ParentsPanel
                  studentId={selected.id}
                  parents={MOCK_PARENTS.filter((p) => p.student_id === selected.id)}
                  getUserById={onMutate.getUserById} // Pass helper
                  onAdd={() => setModal({ open: true, type: "editParent", payload: { studentId: selected.id, parentId: null } })}
                  onEdit={(parentId) => setModal({ open: true, type: "editParent", payload: { studentId: selected.id, parentId } })}
                  onDelete={(parentId) =>
                    setConfirm({
                      title: "Xoá phụ huynh?",
                      description: "Sẽ xoá liên kết liên lạc của phụ huynh này với học sinh.",
                      confirmLabel: "Xóa",
                      onConfirm: () => {
                        pushAudit("DELETE_PARENT", "parents", parentId);
                        setConfirm(null);
                      },
                    })
                  }
                />
              ) : null}

              {drawerTab === "notifications" ? (
                <NotificationsPanel
                  studentId={selected.id}
                  notifications={MOCK_NOTIFICATIONS.filter((n) => n.student_id === selected.id)}
                  parents={MOCK_PARENTS.filter((p) => p.student_id === selected.id)}
                  onResend={handleResendNotification}
                />
              ) : null}

              {drawerTab === "audit" ? (
                <AuditPanel
                  studentId={selected.id}
                  auditLogs={auditLogs}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal system */}
      {modal.open ? (
        <ModalHost modal={modal} onClose={() => setModal({ ...modal, open: false })} onAudit={pushAudit} onMutate={onMutate} />
      ) : null}
      
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.title}
        description={confirm?.description}
        onConfirm={confirm?.onConfirm}
        confirmLabel={confirm?.confirmLabel}
      />
    </div>
  );
}
