
import { useState, useMemo } from "react";
import {
  MOCK_SUBJECTS,
  MOCK_CLASSES,
  MOCK_USERS,
  MOCK_TEACHERS,
  MOCK_TEACHER_SUBJECTS,
  MOCK_TEACHER_ASSIGNMENTS,
  MOCK_AUDIT_LOGS,
} from "../data/mockTeacherData";
import { nowStr } from "../utils/teacherHelpers";

export default function useAdminTeacherLogic() {
  // -----------------------------
  // 1) DATA STATE
  // -----------------------------
  const subjects = useMemo(() => MOCK_SUBJECTS, []);
  const classes = useMemo(() => MOCK_CLASSES, []);

  const [users, setUsers] = useState(MOCK_USERS);
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [teacherSubjects, setTeacherSubjects] = useState(MOCK_TEACHER_SUBJECTS);
  const [teacherAssignments, setTeacherAssignments] = useState(MOCK_TEACHER_ASSIGNMENTS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

  // -----------------------------
  // 2) UI STATE (Filters & Paging)
  // -----------------------------
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [onlyHomeroom, setOnlyHomeroom] = useState(false);
  const [onlyAssigned, setOnlyAssigned] = useState(false);
  const [sortKey, setSortKey] = useState("RECENT");

  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 7;

  // -----------------------------
  // 3) UI STATE (Modals & Toast)
  // -----------------------------
  const [toast, setToast] = useState(null);
  const [drawerTeacherId, setDrawerTeacherId] = useState(null);
  const [showUpsert, setShowUpsert] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  // -----------------------------
  // 4) HELPER / DERIVED DATA
  // -----------------------------
  const normalize = (str) => str.toLowerCase().trim();

  // Maps for quick lookup
  const subjectById = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, s])), [subjects]);
  const classById = useMemo(() => Object.fromEntries(classes.map((c) => [c.id, c])), [classes]);
  const userById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);

  // Combined Rows
  const teacherRows = useMemo(() => {
    return teachers.map((t) => {
      const u = userById[t.user_id];
      const caps = teacherSubjects
        .filter((x) => x.teacher_id === t.id)
        .map((x) => subjectById[x.subject_id])
        .filter(Boolean);

      const assigns = teacherAssignments.filter((a) => a.teacher_id === t.id);
      const homerooms = assigns
        .filter((a) => a.role === "HOMEROOM")
        .map((a) => classById[a.class_id]?.name)
        .filter(Boolean);
      const teaching = assigns.filter((a) => a.role === "SUBJECT");

      const teachingClasses = Array.from(new Set(teaching.map((a) => classById[a.class_id]?.name).filter(Boolean)));
      const teachingSubjects = Array.from(new Set(teaching.map((a) => subjectById[a.subject_id]?.code).filter(Boolean)));

      // Workload estimate
      const workload = homerooms.length * 2 + teaching.length * 4;

      const lastLog = auditLogs
        .filter((l) => l.entity_id === t.id || l.entity_id === t.user_id)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0];

      return {
        teacher_id: t.id,
        teacher_code: t.teacher_code,
        is_active: t.is_active,
        user_id: t.user_id,
        username: u?.username ?? "",
        full_name: u?.full_name ?? "",
        email: u?.email ?? "",
        phone: u?.phone ?? "",
        status: u?.status ?? "ACTIVE",
        created_at: u?.created_at ?? "",
        updated_at: u?.updated_at ?? "",
        capability: caps,
        homerooms,
        teachingClasses,
        teachingSubjects,
        assignmentCount: assigns.length,
        workload,
        lastAction: lastLog ? `${lastLog.action} • ${lastLog.created_at}` : "—",
      };
    });
  }, [teachers, users, teacherSubjects, teacherAssignments, subjectById, classById, userById, auditLogs]);

  // Filtering
  const filteredRows = useMemo(() => {
    const qq = normalize(q);

    const hasSubject = (row) => {
      if (subjectFilter === "ALL") return true;
      const inCap = row.capability.some((s) => s?.id === subjectFilter);
      const inAssign = teacherAssignments.some((a) => a.teacher_id === row.teacher_id && a.subject_id === subjectFilter);
      return inCap || inAssign;
    };

    const hasClass = (row) => {
      if (classFilter === "ALL") return true;
      return teacherAssignments.some((a) => a.teacher_id === row.teacher_id && a.class_id === classFilter);
    };

    let rows = teacherRows.filter((row) => {
      if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
      if (onlyHomeroom && row.homerooms.length === 0) return false;
      if (onlyAssigned && row.assignmentCount === 0) return false;
      if (!hasSubject(row)) return false;
      if (!hasClass(row)) return false;

      if (!qq) return true;
      return (
        row.teacher_code.toLowerCase().includes(qq) ||
        row.full_name.toLowerCase().includes(qq) ||
        row.email.toLowerCase().includes(qq) ||
        row.username.toLowerCase().includes(qq)
      );
    });

    // Sorting
    rows.sort((a, b) => {
      if (sortKey === "NAME") return a.full_name.localeCompare(b.full_name);
      if (sortKey === "WORKLOAD") return b.workload - a.workload;
      return a.updated_at < b.updated_at ? 1 : -1; // RECENT
    });

    return rows;
  }, [teacherRows, q, statusFilter, subjectFilter, classFilter, onlyHomeroom, onlyAssigned, sortKey, teacherAssignments]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pagedRows = useMemo(() => {
    const p = Math.min(page, totalPages);
    const start = (p - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, totalPages, pageSize]);

  // Insights
  const insights = useMemo(() => {
    const total = teacherRows.length;
    const active = teacherRows.filter((r) => r.status === "ACTIVE").length;
    const locked = teacherRows.filter((r) => r.status === "LOCKED").length;
    const assigned = teacherRows.filter((r) => r.assignmentCount > 0).length;
    const homeroom = teacherRows.filter((r) => r.homerooms.length > 0).length;
    const avgWorkload = total ? Math.round((teacherRows.reduce((s, r) => s + r.workload, 0) / total) * 10) / 10 : 0;

    // --- Workload & Sessions Simulation (Weekly) ---
    // Simulate attendance_sessions count for the current week (Mon-Sun)
    // In a real app, this would come from joining attendance_sessions + timetable_entries
    const workloadStats = (() => {
      // 1. Generate random session counts for this week (0 to 22)
      // Stable random based on teacher ID to avoid flickering on re-renders
      const getWeeklySessions = (tid) => {
        let hash = 0;
        for (let i = 0; i < tid.length; i++) hash = (hash << 5) - hash + tid.charCodeAt(i);
        const rand = (Math.abs(hash) % 23); // 0..22
        return rand;
      };

      const withSessions = teacherRows.map(t => ({
        ...t,
        weeklySessions: getWeeklySessions(t.teacher_id)
      })).sort((a, b) => b.weeklySessions - a.weeklySessions);

      // 2. Bands
      // Light (0-5), Moderate (6-10), Heavy (11-15), Overload (16+)
      const bands = [
        { label: "Nhẹ (0-5)", key: "LIGHT", min: 0, max: 5, value: 0, color: "var(--mc-trans)", hoverColor: "var(--mc)" }, // using theme trans for light
        { label: "Vừa (6-10)", key: "MODERATE", min: 6, max: 10, value: 0, color: "#22c55e", hoverColor: "#16a34a" }, // Green
        { label: "Nặng (11-15)", key: "HEAVY", min: 11, max: 15, value: 0, color: "#f97316", hoverColor: "#ea580c" }, // Orange
        { label: "Quá tải (16+)", key: "OVERLOAD", min: 16, max: 999, value: 0, color: "#ef4444", hoverColor: "#dc2626" } // Red
      ];

      withSessions.forEach(t => {
        const s = t.weeklySessions;
        const b = bands.find(x => s >= x.min && s <= x.max);
        if (b) b.value++;
      });

      // 3. Stats
      const totalSessions = withSessions.reduce((sum, t) => sum + t.weeklySessions, 0);
      const avgSessions = total > 0 ? (totalSessions / total).toFixed(1) : 0;
      const overloadCount = bands.find(b => b.key === "OVERLOAD").value;

      // 4. Top & Bottom 5
      const top5 = withSessions.slice(0, 5);
      const bottom5 = [...withSessions].sort((a, b) => a.weeklySessions - b.weeklySessions).slice(0, 5);

      return { bands, top5, bottom5, avgSessions, overloadCount, totalCount: total };
    })();
    
    // Existing insights (keeping them for the metric cards)
    const buckets = [
      { label: "0–4", min: 0, max: 4, value: 0 },
      { label: "5–9", min: 5, max: 9, value: 0 },
      { label: "10–14", min: 10, max: 14, value: 0 },
      { label: "15+", min: 15, max: 999, value: 0 },
    ];
    teacherRows.forEach((r) => {
      const b = buckets.find((x) => r.workload >= x.min && r.workload <= x.max);
      if (b) b.value += 1;
    });

    const topWorkload = [...teacherRows].sort((a, b) => b.workload - a.workload).slice(0, 5);

    return { total, active, locked, assigned, homeroom, avgWorkload, buckets, topWorkload, workloadStats };
  }, [teacherRows]);

  // -----------------------------
  // 5) ACTIONS & HANDLERS
  // -----------------------------
  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSelect = (teacherId) => {
    setSelectedIds((prev) => (prev.includes(teacherId) ? prev.filter((x) => x !== teacherId) : [...prev, teacherId]));
  };

  const toggleSelectAll = () => {
    const ids = pagedRows.map((r) => r.teacher_id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  // --- CRUD Modals ---
  const openCreate = () => {
    setEditingTeacherId(null);
    setShowUpsert(true);
  };

  const openEdit = (teacherId) => {
    setEditingTeacherId(teacherId);
    setShowUpsert(true);
  };

  const openAssignModal = (teacherId) => {
    setAssignTeacherId(teacherId);
    setShowAssign(true);
  };

  const handleSaveTeacher = (payload) => {
    // payload: { mode, user, teacher, subjectIds }
    if (payload.mode === "create") {
      const newUserId = `u_${Date.now()}`;
      const newTeacherId = `t_${Date.now()}`;

      setUsers((prev) => [
        {
          id: newUserId,
          ...payload.user,
          role: "TEACHER",
          created_at: nowStr(),
          updated_at: nowStr(),
        },
        ...prev,
      ]);

      setTeachers((prev) => [
        { id: newTeacherId, user_id: newUserId, ...payload.teacher },
        ...prev,
      ]);

      setTeacherSubjects((prev) => [
        ...payload.subjectIds.map((sid) => ({
          id: `ts_${Date.now()}_${sid}`,
          teacher_id: newTeacherId,
          subject_id: sid,
        })),
        ...prev,
      ]);

      setAuditLogs((prev) => [
        { id: `al_${Date.now()}`, user_id: "admin", action: "CREATE_TEACHER", entity: "teachers", entity_id: newTeacherId, created_at: nowStr() },
        ...prev,
      ]);
      showToast("success", "Đã tạo", "Giáo viên mới đã được tạo.");
    } else {
      // update
      const t = teachers.find((x) => x.id === payload.teacher.id);
      if (!t) return;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === t.user_id
            ? { ...u, ...payload.user, updated_at: nowStr() }
            : u
        )
      );

      setTeachers((prev) =>
        prev.map((tt) => (tt.id === payload.teacher.id ? { ...tt, ...payload.teacher } : tt))
      );

      // replace capability
      setTeacherSubjects((prev) => {
        const remain = prev.filter((x) => x.teacher_id !== payload.teacher.id);
        const add = payload.subjectIds.map((sid) => ({
          id: `ts_${Date.now()}_${sid}`,
          teacher_id: payload.teacher.id,
          subject_id: sid,
        }));
        return [...add, ...remain];
      });

      setAuditLogs((prev) => [
        { id: `al_${Date.now()}`, user_id: "admin", action: "UPDATE_TEACHER", entity: "teachers", entity_id: payload.teacher.id, created_at: nowStr() },
        ...prev,
      ]);
      showToast("success", "Đã cập nhật", "Thông tin giáo viên đã được lưu.");
    }
    setShowUpsert(false);
  };

  const handleAddAssignment = (a) => {
    // validation logic
    if (a.role === "HOMEROOM") {
      const exist = teacherAssignments.find((x) => x.class_id === a.class_id && x.role === "HOMEROOM");
      if (exist) {
        showToast("warn", "Không hợp lệ", "Lớp này đã có GVCN. Hãy đổi giáo viên chủ nhiệm trước.");
        return;
      }
    }
    const dup = teacherAssignments.find(
      (x) => x.teacher_id === a.teacher_id && x.class_id === a.class_id && x.subject_id === a.subject_id && x.role === a.role
    );
    if (dup) {
      showToast("warn", "Trùng phân công", "Phân công này đã tồn tại.");
      return;
    }

    setTeacherAssignments((prev) => [{ id: `ta_${Date.now()}`, ...a }, ...prev]);
    setAuditLogs((prev) => [{ id: `al_${Date.now()}`, user_id: "admin", action: "ADD_ASSIGNMENT", entity: "teacher_assignments", entity_id: `ta_${Date.now()}`, created_at: nowStr() }, ...prev]);
    showToast("success", "Đã phân công", "Phân công giảng dạy đã được thêm.");
  };

  const handleRemoveAssignment = (assignmentId) => {
    setTeacherAssignments((prev) => prev.filter((x) => x.id !== assignmentId));
    setAuditLogs((prev) => [{ id: `al_${Date.now()}`, user_id: "admin", action: "REMOVE_ASSIGNMENT", entity: "teacher_assignments", entity_id: assignmentId, created_at: nowStr() }, ...prev]);
    showToast("success", "Đã gỡ", "Phân công đã được gỡ.");
  };

  // --- Actions ---
  const lockUnlockUser = (teacherId, nextStatus) => {
    const row = teacherRows.find((r) => r.teacher_id === teacherId);
    if (!row) return;

    const title = nextStatus === "LOCKED" ? "Khóa tài khoản giáo viên?" : "Mở khóa tài khoản giáo viên?";
    const desc =
      nextStatus === "LOCKED"
        ? "Giáo viên sẽ không thể đăng nhập và thao tác điểm danh."
        : "Giáo viên có thể đăng nhập và thao tác phân quyền.";

    setConfirm({
      title,
      desc: `${desc}\n\n• Giáo viên: ${row.full_name} (${row.teacher_code})`,
      actionLabel: nextStatus === "LOCKED" ? "Khóa" : "Mở khóa",
      onConfirm: () => {
        setUsers((prev) => prev.map((u) => (u.id === row.user_id ? { ...u, status: nextStatus, updated_at: nowStr() } : u)));
        setAuditLogs((prev) => [
          {
            id: `al_${Date.now()}`,
            user_id: "admin",
            action: nextStatus === "LOCKED" ? "LOCK_USER" : "UNLOCK_USER",
            entity: "users",
            entity_id: row.user_id,
            created_at: nowStr(),
          },
          ...prev,
        ]);
        showToast("success", "Thành công", `${nextStatus === "LOCKED" ? "Đã khóa" : "Đã mở khóa"} tài khoản.`);
        setConfirm(null);
      },
    });
  };

  const resetPassword = (teacherId) => {
    const row = teacherRows.find((r) => r.teacher_id === teacherId);
    if (!row) return;
    setConfirm({
      title: "Reset mật khẩu?",
      desc: `Hành động này sẽ tạo mật khẩu mới và ghi audit log.\n\n• Giáo viên: ${row.full_name} (${row.teacher_code})`,
      actionLabel: "Reset",
      onConfirm: () => {
        setAuditLogs((prev) => [
          {
            id: `al_${Date.now()}`,
            user_id: "admin",
            action: "RESET_PASSWORD",
            entity: "users",
            entity_id: row.user_id,
            created_at: nowStr(),
          },
          ...prev,
        ]);
        showToast("success", "Đã reset", "Mật khẩu mới đã được tạo.");
        setConfirm(null);
      },
    });
  };

  const deleteTeacher = (teacherId) => {
    const row = teacherRows.find((r) => r.teacher_id === teacherId);
    if (!row) return;

    const hasAssignments = teacherAssignments.some((a) => a.teacher_id === teacherId);
    const warn = hasAssignments
      ? "Giáo viên đang có phân công. Khuyến nghị gỡ phân công trước khi xóa."
      : "Bạn có chắc muốn xóa giáo viên này?";

    setConfirm({
      title: "Xóa giáo viên?",
      desc: `${warn}\n\n• Giáo viên: ${row.full_name} (${row.teacher_code})`,
      actionLabel: "Xóa",
      onConfirm: () => {
        setTeacherAssignments((prev) => prev.filter((a) => a.teacher_id !== teacherId));
        setTeacherSubjects((prev) => prev.filter((x) => x.teacher_id !== teacherId));
        setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
        setAuditLogs((prev) => [
          {
            id: `al_${Date.now()}`,
            user_id: "admin",
            action: "DELETE_TEACHER",
            entity: "teachers",
            entity_id: teacherId,
            created_at: nowStr(),
          },
          ...prev,
        ]);
        showToast("success", "Đã xóa", "Giáo viên đã được xóa.");
        setConfirm(null);
      },
    });
  };

  const bulkLock = (nextStatus) => {
    if (selectedIds.length === 0) return showToast("warn", "Chưa chọn", "Hãy chọn ít nhất 1 giáo viên.");
    setConfirm({
      title: nextStatus === "LOCKED" ? "Khóa hàng loạt?" : "Mở khóa hàng loạt?",
      desc: `Áp dụng cho ${selectedIds.length} giáo viên đang chọn.`,
      actionLabel: nextStatus === "LOCKED" ? "Khóa" : "Mở khóa",
      onConfirm: () => {
        const userIds = teacherRows.filter((r) => selectedIds.includes(r.teacher_id)).map((r) => r.user_id);
        setUsers((prev) => prev.map((u) => (userIds.includes(u.id) ? { ...u, status: nextStatus, updated_at: nowStr() } : u)));
        setAuditLogs((prev) => [
          {
            id: `al_${Date.now()}`,
            user_id: "admin",
            action: nextStatus === "LOCKED" ? "BULK_LOCK_USER" : "BULK_UNLOCK_USER",
            entity: "users",
            entity_id: userIds.join(","),
            created_at: nowStr(),
          },
          ...prev,
        ]);
        showToast("success", "Thành công", `${nextStatus === "LOCKED" ? "Đã khóa" : "Đã mở khóa"} hàng loạt.`);
        setConfirm(null);
      },
    });
  };

  const exportCsv = () => {
    showToast("success", "Export", "Đã export danh sách.");
  };

  return {
    // Data & State
    subjects,
    classes,
    users,
    teachers,
    teacherSubjects,
    teacherAssignments,
    auditLogs,
    teacherRows, // derived
    filteredRows, // derived
    pagedRows, // derived
    insights, // derived

    // Filter State
    q, setQ,
    statusFilter, setStatusFilter,
    subjectFilter, setSubjectFilter,
    classFilter, setClassFilter,
    onlyHomeroom, setOnlyHomeroom,
    onlyAssigned, setOnlyAssigned,
    sortKey, setSortKey,
    page, setPage, pageSize, totalPages,
    selectedIds, toggleSelect, toggleSelectAll,

    // Modal & Action State
    toast,
    confirm, setConfirm,
    drawerTeacherId, setDrawerTeacherId,
    showUpsert, setShowUpsert, editingTeacherId,
    showAssign, setShowAssign, assignTeacherId,

    // Actions
    openCreate,
    openEdit,
    openAssignModal,
    handleSaveTeacher,
    handleAddAssignment,
    handleRemoveAssignment,
    lockUnlockUser,
    resetPassword,
    deleteTeacher,
    bulkLock,
    exportCsv,
  };
}
