import { useState, useMemo, useEffect, useRef } from "react";
import {
  MOCK_ACADEMIC_YEARS,
  MOCK_GRADES,
  MOCK_USERS,
  MOCK_TEACHERS,
  MOCK_CLASSES,
  MOCK_TEACHER_ASSIGNMENTS,
  MOCK_STUDENTS,
  MOCK_STUDENT_ROLES,
  MOCK_AUDIT_LOGS,
  MOCK_TIMETABLES,
  MOCK_TIMETABLE_ENTRIES,
  MOCK_ATTENDANCE_RECORDS,
} from "../data/mockData";
import { uid, normalize, pickCurrentYearId, nowStr } from "../utils/classHelpers";

export function useAdminClassesLogic() {
  /** state store (mock CRUD) */
  const [years, setYears] = useState(MOCK_ACADEMIC_YEARS);
  const [grades] = useState(MOCK_GRADES);
  const [users, setUsers] = useState(MOCK_USERS);
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [assignments, setAssignments] = useState(MOCK_TEACHER_ASSIGNMENTS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [roles] = useState(MOCK_STUDENT_ROLES);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

  // để giữ “lớp cũ vẫn xem lại thành viên” sau khi chuyển năm học
  const [archivedMembers, setArchivedMembers] = useState({});

  /** filters */
  const [yearId, setYearId] = useState(() => pickCurrentYearId(MOCK_ACADEMIC_YEARS));
  const [gradeId, setGradeId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const [onlyNoHomeroom, setOnlyNoHomeroom] = useState(false);
  const [onlyOverCap, setOnlyOverCap] = useState(false);
  const [capSize, setCapSize] = useState(45);

  /** table */
  const [expanded, setExpanded] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const pageSize = 6;

  /** modals */
  const [openForm, setOpenForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [openPromote, setOpenPromote] = useState(false);
  const [confirm, setConfirm] = useState(null);

  /** toasts */
  const [toasts, setToasts] = useState([]);
  const toastTimer = useRef(null);

  const pushToast = (message, type = "info") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2600);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  /** indexes */
  const userById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);
  const teacherById = useMemo(() => Object.fromEntries(teachers.map((t) => [t.id, t])), [teachers]);
  const classById = useMemo(() => Object.fromEntries(classes.map((c) => [c.id, c])), [classes]);
  const gradeById = useMemo(() => Object.fromEntries(grades.map((g) => [g.id, g])), [grades]);
  const yearById = useMemo(() => Object.fromEntries(years.map((y) => [y.id, y])), [years]);
  const roleById = useMemo(() => Object.fromEntries(roles.map((r) => [r.id, r])), [roles]);

  const homeroomTeacherIdByClass = useMemo(() => {
    const map = {};
    for (const a of assignments) {
      if (a.role === "HOMEROOM") map[a.class_id] = a.teacher_id;
    }
    return map;
  }, [assignments]);

  const homeroomTeacherName = (classId) => {
    const tid = homeroomTeacherIdByClass[classId];
    if (!tid) return null;
    const t = teacherById[tid];
    const u = t ? userById[t.user_id] : null;
    return u?.full_name || null;
  };

  const homeroomTeacherStatus = (classId) => {
    const tid = homeroomTeacherIdByClass[classId];
    if (!tid) return null;
    const t = teacherById[tid];
    const u = t ? userById[t.user_id] : null;
    return u?.status || null;
  };

  const classStudents = (classId) => {
    // nếu lớp đã “archive”, ưu tiên snapshot để vẫn xem lại lịch sử
    const snap = archivedMembers[classId];
    if (snap && Array.isArray(snap)) return snap;
    return students.filter((s) => s.class_id === classId);
  };

  const classCounts = (classId) => {
    const list = classStudents(classId);
    let active = 0, transferred = 0, inactive = 0;
    for (const s of list) {
      if (s.status === "ACTIVE") active++;
      else if (s.status === "TRANSFERRED") transferred++;
      else inactive++;
    }
    return { total: list.length, active, transferred, inactive };
  };

  /** filtered list */
  const filteredClasses = useMemo(() => {
    const nq = normalize(q);
    return classes
      .filter((c) => c.academic_year_id === yearId)
      .filter((c) => (gradeId === "ALL" ? true : c.grade_id === gradeId))
      .filter((c) => (status === "ALL" ? true : c.status === status))
      .filter((c) => {
        if (!nq) return true;
        return normalize(c.class_name).includes(nq);
      })
      .filter((c) => {
        if (!onlyNoHomeroom) return true;
        return !homeroomTeacherIdByClass[c.id];
      })
      .filter((c) => {
        if (!onlyOverCap) return true;
        const { active } = classCounts(c.id);
        return active > capSize;
      })
      .sort((a, b) => a.class_name.localeCompare(b.class_name));
  }, [
    classes,
    yearId,
    gradeId,
    status,
    q,
    onlyNoHomeroom,
    onlyOverCap,
    capSize,
    homeroomTeacherIdByClass,
    students,
    archivedMembers,
  ]);

  /** pagination */
  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize));
  useEffect(() => setPage(1), [yearId, gradeId, status, q, onlyNoHomeroom, onlyOverCap, capSize]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredClasses.slice(start, start + pageSize);
  }, [filteredClasses, page]);

  /** overview + charts data */
  const overview = useMemo(() => {
    const list = classes.filter((c) => c.academic_year_id === yearId);

    let open = 0, closed = 0;
    let totalStudents = 0, activeStudents = 0, transferredStudents = 0, inactiveStudents = 0;
    let missingHomeroom = 0;

    const classSizes = list.map((c) => {
      const cc = classCounts(c.id);
      totalStudents += cc.total;
      activeStudents += cc.active;
      transferredStudents += cc.transferred;
      inactiveStudents += cc.inactive;
      if (c.status === "OPEN") open++;
      else closed++;
      if (!homeroomTeacherIdByClass[c.id]) missingHomeroom++;
      return { id: c.id, name: c.class_name, active: cc.active, total: cc.total };
    });

    const topBig = [...classSizes].sort((a, b) => b.active - a.active).slice(0, 3);
    const topSmall = [...classSizes].sort((a, b) => a.active - b.active).slice(0, 3);

    return {
      open,
      closed,
      missingHomeroom,
      totalStudents,
      activeStudents,
      transferredStudents,
      inactiveStudents,
      topBig,
      topSmall,
    };
  }, [classes, yearId, students, archivedMembers, homeroomTeacherIdByClass]);

  const barTopByActive = useMemo(() => {
    const list = classes
      .filter((c) => c.academic_year_id === yearId)
      .map((c) => {
        const cc = classCounts(c.id);
        return { key: c.id, label: c.class_name, value: cc.active };
      })
      .sort((a, b) => b.value - a.value);
    return list;
  }, [classes, yearId, students, archivedMembers]);

  const stackedRows = useMemo(() => {
    const list = classes
      .filter((c) => c.academic_year_id === yearId)
      .map((c) => {
        const cc = classCounts(c.id);
        return {
          key: c.id,
          label: c.class_name,
          active: cc.active,
          transferred: cc.transferred,
          inactive: cc.inactive,
        };
      })
      .sort((a, b) => (b.active + b.transferred + b.inactive) - (a.active + a.transferred + a.inactive));
    return list;
  }, [classes, yearId, students, archivedMembers]);

  const donutStatus = useMemo(() => {
    const list = classes.filter((c) => c.academic_year_id === yearId);
    const open = list.filter((c) => c.status === "OPEN").length;
    const closed = list.length - open;
    return [
      { label: "OPEN", value: open, color: "var(--mc)" },
      { label: "CLOSED", value: closed, color: "rgba(99,102,241,.55)" },
    ];
  }, [classes, yearId]);

  /** actionable stats (New) */
  const actionableStats = useMemo(() => {
    // 1. OPERATION READINESS
    const relevantClasses = classes.filter(c => c.academic_year_id === yearId && c.status === "OPEN");
    const issues = [];
    
    // helper: find active timetable
    const today = nowStr().split(" ")[0]; // YYYY-MM-DD
    const activeTimetables = MOCK_TIMETABLES.filter(t => t.effective_from <= today && t.effective_to >= today);
    const methodTimetableByClass = {}; 
    activeTimetables.forEach(t => methodTimetableByClass[t.class_id] = t);

    relevantClasses.forEach(c => {
       const classIssues = [];
       // Missing Homeroom
       if (!homeroomTeacherIdByClass[c.id]) {
         classIssues.push("MISSING_HOMEROOM");
       } else {
         // Homeroom Locked
         const status = homeroomTeacherStatus(c.id);
         if (status === "LOCKED") classIssues.push("HOMEROOM_LOCKED");
       }
       
       // Missing Timetable
       const tt = methodTimetableByClass[c.id];
       if (!tt) {
         classIssues.push("MISSING_TIMETABLE");
       } else {
         // Check entries
         const entries = MOCK_TIMETABLE_ENTRIES.filter(e => e.timetable_id === tt.id);
         if (entries.length === 0) classIssues.push("MISSING_TIMETABLE");
       }
       
       // Low Fingerprint Coverage
       const stus = classStudents(c.id).filter(s => s.status === "ACTIVE");
       if (stus.length > 0) {
         const withFp = stus.filter(s => !!s.fingerprint_id).length;
         const coverage = withFp / stus.length;
         if (coverage < 0.95) {
             classIssues.push("LOW_FINGERPRINT");
         }
         c.meta_coverage = coverage; // attach for UI
       } else {
         c.meta_coverage = 1;
       }

       if (classIssues.length > 0) {
         issues.push({ class: c, issues: classIssues, issueCount: classIssues.length });
       }
    });
    
    // Sort by urgency (issue count)
    const readinessList = issues.sort((a,b) => b.issueCount - a.issueCount);
    
    const issueCounts = {
      MISSING_HOMEROOM: 0,
      HOMEROOM_LOCKED: 0,
      MISSING_TIMETABLE: 0,
      LOW_FINGERPRINT: 0
    };
    readinessList.forEach(item => {
      item.issues.forEach(i => issueCounts[i] = (issueCounts[i] || 0) + 1);
    });

    // 2. ATTENDANCE HOTSPOTS
    // Aggregate records by class
    const hotspotMap = {}; // classId -> { total, late, absent }
    MOCK_ATTENDANCE_RECORDS.forEach(r => {
      const s = students.find(x => x.id === r.student_id);
      if (!s || !s.class_id) return;
      
      if (!hotspotMap[s.class_id]) hotspotMap[s.class_id] = { total: 0, late: 0, absent: 0 };
      const h = hotspotMap[s.class_id];
      h.total++;
      if (r.status === "LATE") h.late++;
      if (r.status.startsWith("ABSENT")) h.absent++;
    });
    
    const hotspots = Object.keys(hotspotMap).map(cid => {
       const h = hotspotMap[cid];
       const c = classById[cid];
       if (!c) return null;
       const lateRate = h.total ? h.late / h.total : 0;
       const absentRate = h.total ? h.absent / h.total : 0;
       const score = (absentRate * 0.7) + (lateRate * 0.3);
       return { 
         class: c, 
         lateRate, 
         absentRate, 
         score,
         counts: h 
       };
    }).filter(x => x && x.score > 0).sort((a,b) => b.score - a.score).slice(0, 6);
    
    // 3. TIME BANDS
    const bands = { A: 0, B: 0, C: 0, D: 0 }; // Late+Absent counts
    MOCK_ATTENDANCE_RECORDS.forEach(r => {
       if (r.status === "PRESENT") return;
       const h = parseInt(r.start_time.split(":")[0]);
       if (h <= 8) bands.A++;
       else if (h <= 10) bands.B++;
       else if (h <= 13) bands.C++;
       else bands.D++;
    });

    return {
      readiness: { list: readinessList, counts: issueCounts },
      attendance: { hotspots, bands }
    };

  }, [classes, yearId, students, homeroomTeacherIdByClass, classById]);

  /** actions */
  const toggleExpand = (classId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) next.delete(classId);
      else next.add(classId);
      return next;
    });
  };

  const openCreate = () => {
    setEditingClass(null);
    setOpenForm(true);
  };

  const openEdit = (c) => {
    setEditingClass(c);
    setOpenForm(true);
  };

  const setClassStatus = (classId, nextStatus) => {
    // Replaced with setConfirm in original AdminClasses but logic remains as a handler
    // We will export a low-level handler or keep it high level? 
    // In original: setConfirm is used to TRIGGER this action.
    // So this function logic is what executes inside onConfirm.
    
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, status: nextStatus } : c)));
    setAuditLogs((prev) => [
      { id: uid(), user_id: "admin", action: nextStatus === "OPEN" ? "OPEN_CLASS" : "CLOSE_CLASS", entity: "classes", entity_id: classId, created_at: nowStr() },
      ...prev,
    ]);
    pushToast(nextStatus === "OPEN" ? "Đã mở lớp" : "Đã đóng lớp", "success");
  };

  const exportExcel = () => {
    setAuditLogs((prev) => [
      { id: uid(), user_id: "admin", action: "EXPORT_CLASSES", entity: "excel", entity_id: uid(), created_at: nowStr() },
      ...prev,
    ]);
    pushToast("Xuất Excel (mock) thành công", "success");
  };

  const updateStudentRole = (studentId, roleId) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, student_role_id: roleId } : s)));
    pushToast("Đã cập nhật chức vụ học sinh", "success");
  };

  const moveStudentToClass = (classId, studentId) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, class_id: classId, status: "ACTIVE" } : s))
    );
    pushToast("Đã thêm học sinh vào lớp", "success");
  };

  const removeStudentFromClass = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    pushToast("Đã xóa học sinh khỏi lớp", "success");
  };
  
 return {
    // state
    years, grades, users, teachers, classes, assignments, students, roles, auditLogs,
    archivedMembers,
    
    // filter state
    yearId, setYearId,
    gradeId, setGradeId,
    status, setStatus,
    q, setQ,
    onlyNoHomeroom, setOnlyNoHomeroom,
    onlyOverCap, setOnlyOverCap,
    capSize, setCapSize,
    
    // table state
    expanded, toggleExpand,
    page, setPage, totalPages, pageSize, pageItems,
    filteredClasses,

    // modal state
    openForm, setOpenForm,
    editingClass, setEditingClass,
    openPromote, setOpenPromote,
    confirm, setConfirm,
    
    // toast state
    toasts, pushToast, removeToast,

    // helpers / lookups
    userById, teacherById, gradeById, yearById, roleById,
    homeroomTeacherIdByClass, homeroomTeacherName, homeroomTeacherStatus,
    classStudents, classCounts,
    
    // computed
    overview, barTopByActive, stackedRows, donutStatus,
    actionableStats,
    
    // actions
    openCreate, openEdit,
    setClassStatus, exportExcel,
    updateStudentRole, moveStudentToClass, removeStudentFromClass,
    
    // setters (for advanced cases like wizards needing raw setters)
    setClasses, setAssignments, setAuditLogs, setStudents, setArchivedMembers
  };
}
