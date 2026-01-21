import { MOCK_CLASSES, MOCK_LOGS, MOCK_SESSIONS, MOCK_RECORDS } from "../data/mockData";

export const getClassName = (classId) => MOCK_CLASSES.find((c) => c.id === classId)?.name || "—";

export const parseDate = (s) => new Date(s.replace(" ", "T"));
export const dateOnly = (dt) => dt.toISOString().slice(0, 10);
export const uid = () => `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
export const uidUser = () => `u_${Math.random().toString(16).slice(2)}_${Date.now()}`;

export const withinDays = (d, days) => {
  const now = new Date("2026-01-17T12:00:00"); // mock "today"
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
};

export const computeLastIn = (studentId) => {
  const ins = MOCK_LOGS
    .filter((l) => l.student_id === studentId && l.log_type === "IN")
    .map((l) => parseDate(l.log_time))
    .sort((a, b) => b - a);
  return ins[0] ? ins[0] : null;
};

export const computeAttendanceSummary = (studentId, days) => {
  const sessionsInRange = MOCK_SESSIONS.filter((s) => {
    const sd = new Date(`${s.session_date}T00:00:00`);
    return withinDays(sd, days);
  }).map((s) => s.id);

  const recs = MOCK_RECORDS.filter(
    (r) => r.student_id === studentId && sessionsInRange.includes(r.attendance_session_id)
  );

  const sum = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0, total: 0 };
  recs.forEach((r) => {
    sum[r.status] = (sum[r.status] || 0) + 1;
    sum.total += 1;
  });

  const lateRate = sum.total ? sum.LATE / sum.total : 0;
  const absentRate = sum.total ? (sum.ABSENT_EXCUSED + sum.ABSENT_UNEXCUSED) / sum.total : 0;

  return { ...sum, lateRate, absentRate, records: recs };
};
