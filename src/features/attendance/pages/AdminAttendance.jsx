import React, { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiDatabase,
  FiDownload,
  FiEye,
  FiFilter,
  FiInfo,
  FiLock,
  FiRefreshCw,
  FiTool,
  FiUnlock,
  FiUpload,
  FiZap,
} from "react-icons/fi";

import "../styles/AdminAttendance.css";

import Card from "../../dashboard/admin/components/ui/Card";
import Select from "../../dashboard/admin/components/ui/Select";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import Pagination from "../../dashboard/admin/components/ui/Pagination";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

import {
  MOCK_ACADEMIC_YEARS,
  MOCK_CLASSES,
  MOCK_STUDENTS,
  SYSTEM_CONFIG,
  INIT_SESSIONS,
  INIT_LOGS,
  INIT_RECORDS,
} from "../constants/mockData";

import {
  uid,
  norm,
  getCurrentYearId,
  isBetween,
  timeToMinutes,
  dtToDateStr,
  dtToTimeStr,
  statusPill,
} from "../utils/attendanceUtils";

import ModalHost from "../components/Modals/ModalHost";
import Calendar from "../../dashboard/admin/components/ui/Calendar/Calendar";

export default function AdminAttendance() {
  const [years] = useState(MOCK_ACADEMIC_YEARS);
  const [classes] = useState(MOCK_CLASSES);
  const [students] = useState(MOCK_STUDENTS);

  const [sessions, setSessions] = useState(INIT_SESSIONS);
  const [logs, setLogs] = useState(INIT_LOGS);
  const [records, setRecords] = useState(INIT_RECORDS);

  // audit logs (mock) — dùng để show modal Audit
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "au_1",
      at: "2025-01-13T09:12:00",
      actor: "admin@school.edu",
      action: "RECONCILE_SESSION",
      target: "ss2",
      note: "Reconcile SMART",
    },
    {
      id: "au_2",
      at: "2025-01-13T10:05:00",
      actor: "admin@school.edu",
      action: "LOCK_SESSION",
      target: "ss1",
      note: "Close & lock",
    },
  ]);

  const [view, setView] = useState("SESSIONS"); // SESSIONS | LOGS | ANOMALIES

  // filters
  const [yearId, setYearId] = useState(getCurrentYearId(years));
  const year = useMemo(
    () => years.find((y) => y.id === yearId) || years[0],
    [years, yearId]
  );

  const classOptions = useMemo(() => {
    const cls = classes.filter((c) => c.academic_year_id === yearId);
    return [
      { value: "ALL", label: "Tất cả lớp" },
      ...cls.map((c) => ({ value: c.id, label: c.class_name })),
    ];
  }, [classes, yearId]);

  const [classId, setClassId] = useState("ALL");
  useEffect(() => setClassId("ALL"), [yearId]);

  const [status, setStatus] = useState("ALL"); // ALL, DRAFT, GENERATED, IN_PROGRESS, CLOSED

  const [from, setFrom] = useState(() => year?.start_date || "2024-08-15");
  const [to, setTo] = useState(() => year?.end_date || "2025-05-31");
  useEffect(() => {
    setFrom(year?.start_date || "2024-08-15");
    setTo(year?.end_date || "2025-05-31");
  }, [yearId]); // eslint-disable-line

  const [q, setQ] = useState("");

  // derived filters
  const sessionsFiltered = useMemo(() => {
    const nq = norm(q);
    const clsName = (cid) => classes.find((c) => c.id === cid)?.class_name || "—";
    return sessions
      .filter((s) => s.academic_year_id === yearId)
      .filter((s) => (classId === "ALL" ? true : s.class_id === classId))
      .filter((s) => (status === "ALL" ? true : s.status === status))
      .filter((s) => isBetween(s.session_date, from, to))
      .filter((s) => {
        if (!nq) return true;
        const hay = `${clsName(s.class_id)} ${s.session_date} ${s.id} ${s.start_time}-${s.end_time} ${s.status}`;
        return norm(hay).includes(nq);
      })
      .sort((a, b) => (a.session_date < b.session_date ? 1 : -1));
  }, [sessions, yearId, classId, status, from, to, q, classes]);

  const logsFiltered = useMemo(() => {
    const nq = norm(q);
    const studentById = new Map(students.map((x) => [x.id, x]));
    const clsOf = (sid) => studentById.get(sid)?.class_id;
    return logs
      .filter((l) => {
        const ds = dtToDateStr(l.log_time);
        return isBetween(ds, from, to);
      })
      .filter((l) => {
        const sid = l.student_id;
        const cls = clsOf(sid);
        const inYear = (classes.find((c) => c.id === cls)?.academic_year_id || "") === yearId;
        return inYear;
      })
      .filter((l) => (classId === "ALL" ? true : studentById.get(l.student_id)?.class_id === classId))
      .filter((l) => {
        if (!nq) return true;
        const st = studentById.get(l.student_id);
        const hay = `${st?.student_code || ""} ${st?.full_name || ""} ${l.log_time} ${l.log_type} ${l.source}`;
        return norm(hay).includes(nq);
      })
      .sort((a, b) => (a.log_time < b.log_time ? 1 : -1));
  }, [logs, students, classes, yearId, classId, from, to, q]);

  // anomalies
  const anomalies = useMemo(() => {
    const studentById = new Map(students.map((x) => [x.id, x]));
    const byStudentDateType = new Map(); // key: student|date|type -> list logs
    logsFiltered.forEach((l) => {
      const key = `${l.student_id}|${dtToDateStr(l.log_time)}|${l.log_type}`;
      const arr = byStudentDateType.get(key) || [];
      arr.push(l);
      byStudentDateType.set(key, arr);
    });

    const out = [];

    // 1) duplicate logs
    byStudentDateType.forEach((arr, key) => {
      if (arr.length >= 2) {
        out.push({
          id: `dup_${key}`,
          type: "DUPLICATE_LOG",
          severity: "WARN",
          title: "Log trùng",
          detail: `${key} có ${arr.length} bản ghi (có thể do máy gửi lặp).`,
          ref: arr.map((x) => x.id),
        });
      }
    });

    // 2) out of range logs
    logsFiltered.forEach((l) => {
      const t = dtToTimeStr(l.log_time);
      const m = timeToMinutes(t);
      const inStart = timeToMinutes(SYSTEM_CONFIG.checkin_start_time);
      const outStd = timeToMinutes(SYSTEM_CONFIG.checkout_time);

      if (l.log_type === "IN" && m < inStart - 60) {
        out.push({
          id: `oor_${l.id}`,
          type: "OUT_OF_RANGE",
          severity: "INFO",
          title: "IN quá sớm",
          detail: `Log IN lúc ${t} (có thể ngoài khung check-in).`,
          ref: [l.id],
        });
      }
      if (l.log_type === "OUT" && m > outStd + 120) {
        out.push({
          id: `oor2_${l.id}`,
          type: "OUT_OF_RANGE",
          severity: "INFO",
          title: "OUT quá muộn",
          detail: `Log OUT lúc ${t} (có thể ngoài khung checkout).`,
          ref: [l.id],
        });
      }
    });

    // 3) missing fingerprint_id
    students
      .filter((s) => (classId === "ALL" ? true : s.class_id === classId))
      .filter((s) => (classes.find((c) => c.id === s.class_id)?.academic_year_id || "") === yearId)
      .forEach((s) => {
        if (!s.fingerprint_id) {
          out.push({
            id: `fp_${s.id}`,
            type: "MISSING_FINGERPRINT",
            severity: "WARN",
            title: "Thiếu mã vân tay",
            detail: `${s.student_code} • ${s.full_name} chưa gán fingerprint_id.`,
            ref: [s.id],
          });
        }
      });

    // 4) sessions not generated / missing records
    sessionsFiltered.forEach((ss) => {
      const rec = records.filter((r) => r.attendance_session_id === ss.id);
      if (!rec.length && ss.records_generated) {
        out.push({
          id: `mr_${ss.id}`,
          type: "MISSING_RECORDS",
          severity: "WARN",
          title: "Session thiếu records",
          detail: `Session ${ss.id} đánh dấu đã sinh record nhưng không thấy record nào.`,
          ref: [ss.id],
        });
      }
      if (!ss.records_generated) {
        out.push({
          id: `ng_${ss.id}`,
          type: "NOT_GENERATED",
          severity: "INFO",
          title: "Chưa đối soát",
          detail: `Session ${ss.session_date} ${ss.start_time}-${ss.end_time} chưa sinh attendance_records.`,
          ref: [ss.id],
        });
      }
    });

    return out.sort((a, b) => (a.severity < b.severity ? 1 : -1));
  }, [logsFiltered, students, classes, yearId, classId, sessionsFiltered, records]);

  // KPIs
  const stats = useMemo(() => {
    const totalSessions = sessionsFiltered.length;
    const totalLogs = logsFiltered.length;
    const totalAnom = anomalies.length;

    const recInScope = records.filter((r) => sessionsFiltered.some((s) => s.id === r.attendance_session_id));
    const dist = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
    recInScope.forEach((r) => (dist[r.status] = (dist[r.status] || 0) + 1));
    const totalRec = recInScope.length;

    return { totalSessions, totalLogs, totalAnom, totalRec, dist };
  }, [sessionsFiltered, logsFiltered, anomalies, records]);

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  useEffect(() => setPage(1), [yearId, classId, status, from, to, q, view]);

  const totalPages = useMemo(() => {
    let total = 0;
    if (view === "SESSIONS") total = sessionsFiltered.length;
    else if (view === "LOGS") total = logsFiltered.length;
    else if (view === "ANOMALIES") total = anomalies.length;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [view, sessionsFiltered.length, logsFiltered.length, anomalies.length]);

  const pagedSessions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sessionsFiltered.slice(start, start + PAGE_SIZE);
  }, [sessionsFiltered, page]);

  const pagedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return logsFiltered.slice(start, start + PAGE_SIZE);
  }, [logsFiltered, page]);

  const pagedAnomalies = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return anomalies.slice(start, start + PAGE_SIZE);
  }, [anomalies, page]);

  // MODALS
  const [modal, setModal] = useState({ open: false, type: "", payload: null });
  const [confirm, setConfirm] = useState(null);

  const openModal = (type, payload = null) => setModal({ open: true, type, payload });
  const closeModal = () => setModal({ open: false, type: "", payload: null });

  const pushToast = (title, desc) => openModal("toast", { title, desc });

  // actions -> modal thật
  const onSyncLogs = () => {
    const st = students[Math.floor(Math.random() * students.length)];
    const dateStr = from;
    const t = `07:${String(10 + Math.floor(Math.random() * 40)).padStart(2, "0")}:00`;
    setLogs((prev) => [
      { id: uid(), student_id: st.id, log_time: `${dateStr}T${t}`, log_type: "IN", source: "DEVICE_SYNC" },
      ...prev,
    ]);

    setAuditLogs((prev) => [
      {
        id: uid(),
        at: new Date().toISOString().slice(0, 19),
        actor: "admin@school.edu",
        action: "SYNC_LOGS",
        target: "DEVICE_SYNC",
        note: `Add mock log for ${st?.id || "-"}`,
      },
      ...prev,
    ]);

    openModal("toast", { title: "Đã sync logs", desc: "Đã thêm 1 bản ghi log (mock) từ thiết bị." });
  };

  const onImportLogs = () => openModal("importLogs", { from, to, classId, yearId });
  const onExport = () =>
    openModal("export", {
      from,
      to,
      classId,
      yearId,
      view,
      totals: { sessions: sessionsFiltered.length, logs: logsFiltered.length, anomalies: anomalies.length },
    });
  const onRefresh = () => openModal("refresh", {});

  const openSessionDetails = (sessionId) => openModal("sessionDetails", { sessionId });

  const onToggleLockSession = (ss) => {
    const action = ss.is_locked ? "Mở khóa" : "Khóa";
    setConfirm({
      title: `${action} phiên điểm danh?`,
      description: ss.is_locked
        ? "Mở khóa để cho phép đối soát lại / chỉnh sửa record."
        : "Khóa để đóng băng dữ liệu điểm danh (chốt báo cáo, tránh sửa đổi).",
      confirmLabel: action,
      onConfirm: () => {
        setSessions((prev) =>
          prev.map((x) =>
            x.id === ss.id ? { ...x, is_locked: !x.is_locked, status: !x.is_locked ? "CLOSED" : "IN_PROGRESS" } : x
          )
        );

        setAuditLogs((prev) => [
          {
            id: uid(),
            at: new Date().toISOString().slice(0, 19),
            actor: "admin@school.edu",
            action: ss.is_locked ? "UNLOCK_SESSION" : "LOCK_SESSION",
            target: ss.id,
            note: ss.is_locked ? "Unlock for editing" : "Lock to close",
          },
          ...prev,
        ]);

        setConfirm(null);
      },
    });
  };

  const onReconcileSession = (sessionId) => {
    const ss = sessions.find((x) => x.id === sessionId);
    if (!ss) return;
    if (ss.is_locked) return pushToast("Session đã khóa", "Bạn cần mở khóa trước khi đối soát lại.");
    openModal("reconcile", { sessionId });
  };

  const onOpenDedup = () => openModal("dedup", { from, to, classId, yearId });
  const onOpenAudit = () => openModal("audit", {});
  const onOpenAnomalyDetail = (anomaly) => openModal("anomalyDetail", { anomaly });

  /* ===================== RENDER ===================== */
  const clsName = (cid) => classes.find((c) => c.id === cid)?.class_name || "—";

  return (
    <div className="att-page">
      {/* Top Toolbar */}
      <div className="att-toolbar">
        <div className="att-toolbar__left">
          <div className="att-header">
            <FiCheckCircle />
            <div>
              <div className="att-title">Quản lý điểm danh</div>
              <div className="att-sub">
                Quản lý phiên điểm danh • dữ liệu máy vân tay (logs) • đối soát & kiểm soát bất thường • thống kê
              </div>
            </div>
          </div>
        </div>

        <div className="att-toolbar__right">
          <button className="btn" onClick={onSyncLogs}>
            <FiDatabase /> Sync logs
          </button>
          <button className="btn btn-ghost" onClick={onImportLogs}>
            <FiUpload /> Import
          </button>
          <button className="btn btn-ghost" onClick={onExport}>
            <FiDownload /> Export
          </button>
          <button className="btn btn-ghost" onClick={onRefresh}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card icon={<FiFilter />} title="Bộ lọc" subtitle="Năm học • lớp • thời gian • trạng thái session • tìm kiếm">
        <div className="att-filters">
          <div className="att-filter att-filter--wide">
            <label>Tìm nhanh</label>
            <SearchInput
              value={q}
              onChange={setQ}
              placeholder="Tìm theo lớp / ngày / sessionId / mã HS / tên HS..."
              label={null}
            />
          </div>

          <div className="att-filter">
            <label>Năm học</label>
            <Select value={yearId} onChange={setYearId} options={years.map((y) => ({ value: y.id, label: y.name }))} />
          </div>

          <div className="att-filter">
            <label>Lớp</label>
            <Select value={classId} onChange={setClassId} options={classOptions} />
          </div>

          <div className="att-filter">
            <Calendar label="Từ ngày" value={from} onChange={setFrom} placeholder="Chọn ngày bắt đầu" />
          </div>

          <div className="att-filter">
            <Calendar label="Đến ngày" value={to} onChange={setTo} placeholder="Chọn ngày kết thúc" />
          </div>

          <div className="att-filter">
            <label>Trạng thái session</label>
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: "ALL", label: "Tất cả" },
                { value: "DRAFT", label: "DRAFT" },
                { value: "GENERATED", label: "GENERATED" },
                { value: "IN_PROGRESS", label: "IN_PROGRESS" },
                { value: "CLOSED", label: "CLOSED" },
              ]}
            />
          </div>

        </div>

        <div className="att-chipRow">
          <div className="att-chip">
            <FiInfo /> Cấu hình: check-in <span className="mono">{SYSTEM_CONFIG.checkin_start_time}</span> →{" "}
            <span className="mono">{SYSTEM_CONFIG.checkin_end_time}</span> • checkout{" "}
            <span className="mono">{SYSTEM_CONFIG.checkout_time}</span> • ngưỡng trễ{" "}
            <span className="mono">{SYSTEM_CONFIG.late_threshold_minutes}’</span>
          </div>

          <div className="att-viewTabs">
            <button className={`tab ${view === "SESSIONS" ? "isActive" : ""}`} onClick={() => setView("SESSIONS")}>
              <FiActivity /> Phiên điểm danh
            </button>
            <button className={`tab ${view === "LOGS" ? "isActive" : ""}`} onClick={() => setView("LOGS")}>
              <FiDatabase /> Dữ liệu máy
            </button>
            <button className={`tab ${view === "ANOMALIES" ? "isActive" : ""}`} onClick={() => setView("ANOMALIES")}>
              <FiAlertTriangle /> Bất thường & Đối soát
            </button>
          </div>
        </div>
      </Card>

      {/* Main Layout */}
      <div className="att-grid">
        <div className="att-left">
          {view === "SESSIONS" ? (
            <Card icon={<FiActivity />} title="Danh sách phiên điểm danh" subtitle="Xem • đối soát • khóa/mở khóa • chi tiết records">
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Lớp</th>
                      <th>Giờ</th>
                      <th>Trạng thái</th>
                      <th>Records</th>
                      <th className="tRight">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedSessions.map((ss) => {
                      const rec = records.filter((r) => r.attendance_session_id === ss.id);
                      const dist = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
                      rec.forEach((r) => (dist[r.status] = (dist[r.status] || 0) + 1));
                      const total = rec.length;

                      return (
                        <tr key={ss.id}>
                          <td className="mono">{ss.session_date}</td>
                          <td className="strong">{clsName(ss.class_id)}</td>
                          <td className="mono">
                            {ss.start_time}-{ss.end_time}
                          </td>
                          <td>
                            <span className={`pill ${statusPill(ss.status)}`}>
                              {ss.is_locked ? <FiLock /> : <FiClock />}
                              {ss.status}
                            </span>
                          </td>
                          <td>
                            {ss.records_generated ? (
                              <div className="recMini">
                                <span className="dot ok" /> {dist.PRESENT}
                                <span className="dot warn" /> {dist.LATE}
                                <span className="dot danger" /> {dist.ABSENT_EXCUSED + dist.ABSENT_UNEXCUSED}
                                <span className="muted">/ {total}</span>
                              </div>
                            ) : (
                              <span className="pill pill--warn">
                                <FiAlertTriangle /> Chưa đối soát
                              </span>
                            )}
                          </td>
                          <td className="tRight">
                            <div className="rowBtns">
                              <button className="iconBtn" title="Xem chi tiết" onClick={() => openSessionDetails(ss.id)}>
                                <FiEye />
                              </button>
                              <button className="iconBtn" title="Đối soát (reconcile)" onClick={() => onReconcileSession(ss.id)}>
                                <FiZap />
                              </button>
                              <button
                                className={`iconBtn ${ss.is_locked ? "warn" : ""}`}
                                title="Khóa/Mở khóa session"
                                onClick={() => onToggleLockSession(ss)}
                              >
                                {ss.is_locked ? <FiUnlock /> : <FiLock />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!pagedSessions.length ? (
                      <tr>
                        <td colSpan={6} className="empty">
                          Không có phiên điểm danh phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>

              <div className="hint">
                • Admin dùng “Đối soát” để tạo/cập nhật attendance_records từ dữ liệu máy chấm (logs). <br />
                • “Khóa session” để chốt dữ liệu, đảm bảo minh bạch khi xuất báo cáo.
              </div>
            </Card>
          ) : null}

          {view === "LOGS" ? (
            <Card icon={<FiDatabase />} title="Dữ liệu thô từ máy chấm vân tay" subtitle="Logs IN/OUT • phát hiện trùng • lọc theo lớp/ngày/học sinh">
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Học sinh</th>
                      <th>Lớp</th>
                      <th>Loại</th>
                      <th>Nguồn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedLogs.map((l) => {
                      const st = students.find((x) => x.id === l.student_id);
                      const cls = classes.find((c) => c.id === st?.class_id);
                      return (
                        <tr key={l.id}>
                          <td className="mono">{l.log_time.replace("T", " ")}</td>
                          <td>
                            <div className="strong">{st?.full_name || "—"}</div>
                            <div className="muted mono">{st?.student_code || "—"}</div>
                          </td>
                          <td className="strong">{cls?.class_name || "—"}</td>
                          <td>
                            <span className={`pill ${l.log_type === "IN" ? "pill--ok" : "pill--info"}`}>{l.log_type}</span>
                          </td>
                          <td className="mono muted">{l.source}</td>
                        </tr>
                      );
                    })}
                    {!pagedLogs.length ? (
                      <tr>
                        <td colSpan={5} className="empty">
                          Không có logs phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>

              <div className="hint">
                • Logs là dữ liệu gốc từ máy (IN/OUT), không gắn tiết học. <br />
                • Đối soát sẽ dùng logs + khung giờ session + cấu hình check-in để suy ra PRESENT/LATE/ABSENT.
              </div>
            </Card>
          ) : null}

          {view === "ANOMALIES" ? (
            <Card icon={<FiAlertTriangle />} title="Bất thường & kiểm soát dữ liệu" subtitle="Phát hiện lỗi thiết bị/dữ liệu • hỗ trợ đối soát lại">
              <div className="anomList">
                {pagedAnomalies.map((a) => (
                  <div key={a.id} className={`anomItem ${a.severity === "WARN" ? "warn" : ""}`}>
                    <div className="anomIcon">{a.severity === "WARN" ? <FiAlertTriangle /> : <FiInfo />}</div>
                    <div className="anomMain">
                      <div className="strong">{a.title}</div>
                      <div className="muted">{a.detail}</div>
                    </div>
                    <div className="anomRight">
                      {a.type === "NOT_GENERATED" ? (
                        <button className="btn btn-ghost" onClick={() => onReconcileSession(a.ref[0])}>
                          <FiZap /> Đối soát
                        </button>
                      ) : (
                        <button className="btn btn-ghost" onClick={() => onOpenAnomalyDetail(a)}>
                          <FiEye /> Xem
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {!pagedAnomalies.length ? <div className="empty">Không phát hiện bất thường trong phạm vi lọc.</div> : null}
              </div>

              <div className="pager">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>

              <div className="hint">
                • “Log trùng” thường do máy gửi lặp → cần de-dup. <br />
                • “Thiếu fingerprint_id” khiến logs không khớp học sinh → cần gán vân tay ở module học sinh. <br />
                • “Chưa đối soát” nghĩa là session có nhưng chưa tạo attendance_records.
              </div>
            </Card>
          ) : null}
        </div>

        {/* Right Panel */}
        <div className="att-right">
          <Card icon={<FiInfo />} title="Tóm tắt thống kê" subtitle="KPI nhanh theo bộ lọc hiện tại">
            <div className="kpiGrid">
              <div className="kpi">
                <div className="kpiLabel">Sessions</div>
                <div className="kpiVal">{stats.totalSessions}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Logs</div>
                <div className="kpiVal">{stats.totalLogs}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Records</div>
                <div className="kpiVal">{stats.totalRec}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Anomalies</div>
                <div className="kpiVal">{stats.totalAnom}</div>
              </div>
            </div>

            <div className="dist">
              <div className="distRow">
                <span className="dot ok" /> Present <span className="mono">{stats.dist.PRESENT}</span>
              </div>
              <div className="distRow">
                <span className="dot warn" /> Late <span className="mono">{stats.dist.LATE}</span>
              </div>
              <div className="distRow">
                <span className="dot info" /> Excused <span className="mono">{stats.dist.ABSENT_EXCUSED}</span>
              </div>
              <div className="distRow">
                <span className="dot danger" /> Unexcused <span className="mono">{stats.dist.ABSENT_UNEXCUSED}</span>
              </div>
            </div>

            <div className="opsBtns">
              <button className="btn btn-ghost" onClick={() => setView("ANOMALIES")}>
                <FiTool /> Kiểm soát dữ liệu
              </button>
              <button className="btn btn-ghost" onClick={onExport}>
                <FiDownload /> Export báo cáo
              </button>
            </div>
          </Card>

          <Card icon={<FiTool />} title="Công cụ vận hành" subtitle="Các thao tác admin hay dùng">
            <div className="toolList">
              <button className="btn btn-ghost" onClick={onSyncLogs}>
                <FiDatabase /> Sync logs từ thiết bị
              </button>
              <button className="btn btn-ghost" onClick={onOpenDedup}>
                <FiTool /> Lọc log trùng (de-dup)
              </button>
              <button className="btn btn-ghost" onClick={onOpenAudit}>
                <FiInfo /> Xem audit logs
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {modal.open ? (
        <ModalHost
          modal={modal}
          onClose={closeModal}
          // data
          years={years}
          classes={classes}
          students={students}
          sessions={sessions}
          logs={logs}
          records={records}
          auditLogs={auditLogs}
          // setters
          setSessions={setSessions}
          setLogs={setLogs}
          setRecords={setRecords}
          setAuditLogs={setAuditLogs}
          // helpers
          openModal={openModal}
          pushToast={pushToast}
        />
      ) : null}

      {confirm ? (
        <ConfirmModal
          open={true}
          title={confirm.title}
          description={confirm.description}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      ) : null}
    </div>
  );
}
