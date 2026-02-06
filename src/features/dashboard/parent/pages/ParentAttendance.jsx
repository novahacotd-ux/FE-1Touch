import React, { useState } from 'react';
import './ParentAttendance.css';
import { AiOutlineCalendar } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';

/* ===== ENUM ===== */
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT_EXCUSED: 'ABSENT_EXCUSED',
  ABSENT_UNEXCUSED: 'ABSENT_UNEXCUSED'
};

/* ================= MOCK TABLES (match ERD names) ================= */
const subjects = [
  { id: 1, subject_code: 'TOAN', subject_name: 'Toán', is_active: true },
  { id: 2, subject_code: 'VAN', subject_name: 'Văn', is_active: true },
  { id: 3, subject_code: 'ANH', subject_name: 'Anh', is_active: true }
];

// attendance_sessions (ERD)
const attendance_sessions = [
  { id: 1, timetable_entry_id: 1, session_date: '2024-05-10', start_time: '07:00', end_time: '07:45' },
  { id: 2, timetable_entry_id: 2, session_date: '2024-05-10', start_time: '07:50', end_time: '08:35' },
  { id: 3, timetable_entry_id: 3, session_date: '2024-05-08', start_time: '07:00', end_time: '07:45' }
];

// timetable_entries (ERD) - used to resolve subject for each session
const timetable_entries = [
  { id: 1, timetable_id: 1, date_of_week: 5, start_time: '07:00', end_time: '07:45', subject_id: 1, teacher_id: 101 },
  { id: 2, timetable_id: 1, date_of_week: 5, start_time: '07:50', end_time: '08:35', subject_id: 2, teacher_id: 102 },
  { id: 3, timetable_id: 1, date_of_week: 3, start_time: '07:00', end_time: '07:45', subject_id: 3, teacher_id: 103 }
];

// attendance_records (ERD)
const attendance_records = [
  { id: 1, attendance_session_id: 1, student_id: 'HS001', status: AttendanceStatus.PRESENT, note: '' },
  { id: 2, attendance_session_id: 2, student_id: 'HS001', status: AttendanceStatus.LATE, note: 'Kẹt xe' },
  { id: 3, attendance_session_id: 3, student_id: 'HS001', status: AttendanceStatus.ABSENT_UNEXCUSED, note: '' }
];

// attendance_logs (ERD) - raw fingerprint logs (IN/OUT)
const attendance_logs = [
  { id: 1, student_id: 'HS001', log_time: '2024-05-10T07:02:10', log_type: 'IN' },
  { id: 2, student_id: 'HS001', log_time: '2024-05-10T07:45:05', log_type: 'OUT' },
  { id: 3, student_id: 'HS001', log_time: '2024-05-10T07:55:30', log_type: 'IN' },
  { id: 4, student_id: 'HS001', log_time: '2024-05-10T08:35:12', log_type: 'OUT' }
];
/* ================================================================= */

const getSubjectNameBySessionId = (attendanceSessionId) => {
  const session = attendance_sessions.find(s => s.id === attendanceSessionId);
  if (!session) return 'N/A';
  const entry = timetable_entries.find(e => e.id === session.timetable_entry_id);
  if (!entry) return 'N/A';
  const subject = subjects.find(s => s.id === entry.subject_id);
  return subject ? subject.subject_name : 'N/A';
};

const getCheckinCheckoutBySession = (attendanceSessionId, studentId) => {
  // naive derivation: find first IN and last OUT on that session date
  const session = attendance_sessions.find(s => s.id === attendanceSessionId);
  if (!session) return { checkin_time: null, checkout_time: null };
  const datePrefix = session.session_date; // YYYY-MM-DD
  const logs = attendance_logs
    .filter(l => l.student_id === studentId && l.log_time.startsWith(datePrefix))
    .sort((a, b) => a.log_time.localeCompare(b.log_time));

  const firstIn = logs.find(l => l.log_type === 'IN');
  const lastOut = [...logs].reverse().find(l => l.log_type === 'OUT');

  const toHHMM = (iso) => (iso ? iso.split('T')[1]?.slice(0, 5) : null);
  return { checkin_time: toHHMM(firstIn?.log_time), checkout_time: toHHMM(lastOut?.log_time) };
};

const attendance_view = attendance_records.map(r => {
  const session = attendance_sessions.find(s => s.id === r.attendance_session_id);
  const times = getCheckinCheckoutBySession(r.attendance_session_id, r.student_id);
  return {
    id: r.id,
    student_id: r.student_id,
    session_date: session?.session_date ?? '',
    subject_name: getSubjectNameBySessionId(r.attendance_session_id),
    checkin_time: times.checkin_time,
    checkout_time: times.checkout_time,
    status: r.status,
    note: r.note
  };
});

/* ===== STATUS CLASS ===== */
const STATUS_CLASS = {
  PRESENT: 'status present',
  LATE: 'status late',
  ABSENT_EXCUSED: 'status excused',
  ABSENT_UNEXCUSED: 'status absent'
};

const ParentAttendance = () => {
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('05');

  const filteredRecords = attendance_view.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const matchMonth = r.session_date.split('-')[1] === selectedMonth;
    return matchStatus && matchMonth;
  });

  const groupedRecords = filteredRecords.reduce((acc, cur) => {
    acc[cur.session_date] = acc[cur.session_date] || [];
    acc[cur.session_date].push(cur);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedRecords).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="attendance-wrapper">
      <div className="attendance-card">

        {/* HEADER */}
        <div className="attendance-header">
          <div>
            <h3>Lịch sử điểm danh</h3>
            <p>Dữ liệu chi tiết theo từng ngày học</p>
          </div>

          <div className="attendance-filters">
            {/* Month */}
            <div className="filter-group">
              <label>Tháng</label>
              <div className="select-wrapper">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="05">Tháng 05</option>
                  <option value="04">Tháng 04</option>
                  <option value="03">Tháng 03</option>
                </select>
                <HiChevronDown size={14} />
              </div>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label>Trạng thái</label>
              <div className="status-filter">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: AttendanceStatus.PRESENT, label: 'Có mặt' },
                  { id: AttendanceStatus.LATE, label: 'Muộn' },
                  { id: AttendanceStatus.ABSENT_UNEXCUSED, label: 'Nghỉ' }
                ].map(btn => (
                  <button
                    key={btn.id}
                    className={filter === btn.id ? 'active' : ''}
                    onClick={() => setFilter(btn.id)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        {sortedDates.map(date => (
          <div key={date} className="attendance-day">
            <div className="date-row">
              <AiOutlineCalendar size={16} />
              <span>{date}</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th>Vào</th>
                  <th>Ra</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {groupedRecords[date].map(r => (
                  <tr key={r.id}>
                    <td>{r.subject_name}</td>
                    <td>{r.checkin_time || '--:--'}</td>
                    <td>{r.checkout_time || '--:--'}</td>
                    <td>
                      <span className={STATUS_CLASS[r.status]}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{r.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="empty-state">
            <AiOutlineCalendar size={32} />
            <p>Không có dữ liệu</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentAttendance;
