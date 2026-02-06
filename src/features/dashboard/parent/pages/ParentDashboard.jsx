import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentDashboard.css';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFingerprint
} from 'react-icons/fa';

/* ================= MOCK TABLES (match ERD) ================= */
const academic_years = [
  {
    id: 1,
    name: '2024-2025',
    start_date: '2024-09-01',
    end_date: '2025-05-31',
    is_current: true
  }
];

const classes = [
  { id: 1, class_name: '10A1', grade_id: 1, academic_year_id: 1, status: 'OPEN' }
];

const students = [
  {
    id: 'HS001',
    student_code: 'HS001',
    full_name: 'Nguyễn Văn An',
    gender: 'Nam',
    dob: '2010-05-15',
    class_id: 1,
    student_role_id: 1,
    fingerprint_id: 'FP-001',
    status: 'ACTIVE'
  }
];

const subjects = [
  { id: 1, subject_code: 'TOAN', subject_name: 'Toán', is_active: true },
  { id: 2, subject_code: 'LY', subject_name: 'Vật lý', is_active: true },
  { id: 3, subject_code: 'HOA', subject_name: 'Hóa học', is_active: true },
  { id: 4, subject_code: 'SINH', subject_name: 'Sinh học', is_active: true }
];

const teachers = [
  { id: 101, user_id: 1001, teacher_code: 'GV101', is_active: true, full_name: 'Thầy Minh' },
  { id: 102, user_id: 1002, teacher_code: 'GV102', is_active: true, full_name: 'Cô Lan' },
  { id: 103, user_id: 1003, teacher_code: 'GV103', is_active: true, full_name: 'Thầy Hùng' },
  { id: 104, user_id: 1004, teacher_code: 'GV104', is_active: true, full_name: 'Cô Mai' }
];

const timetables = [
  {
    id: 1,
    class_id: 1,
    academic_year_id: 1,
    effective_from: '2024-05-01',
    effective_to: '2024-05-31'
  }
];

// timetable_entries: tiết học theo ERD
const timetable_entries = [
  { id: 1, timetable_id: 1, date_of_week: 1, start_time: '07:00', end_time: '07:45', subject_id: 1, teacher_id: 101 },
  { id: 2, timetable_id: 1, date_of_week: 1, start_time: '07:50', end_time: '08:35', subject_id: 2, teacher_id: 102 },
  { id: 3, timetable_id: 1, date_of_week: 1, start_time: '08:40', end_time: '09:25', subject_id: 3, teacher_id: 103 },
  { id: 4, timetable_id: 1, date_of_week: 1, start_time: '09:35', end_time: '10:20', subject_id: 4, teacher_id: 104 }
];

// Giả định hôm nay là 2024-05-20 (thứ 2 / 1)
const TODAY = '2024-05-20';

// attendance_sessions (tiết học trong ngày)
const attendance_sessions = [
  { id: 1, timetable_entry_id: 1, session_date: TODAY, start_time: '07:00', end_time: '07:45' },
  { id: 2, timetable_entry_id: 2, session_date: TODAY, start_time: '07:50', end_time: '08:35' },
  { id: 3, timetable_entry_id: 3, session_date: '2024-05-19', start_time: '07:00', end_time: '07:45' },
  { id: 4, timetable_entry_id: 4, session_date: '2024-05-18', start_time: '07:00', end_time: '07:45' }
];

// attendance_records (kết quả điểm danh)
const attendance_records = [
  { id: 1, attendance_session_id: 1, student_id: 'HS001', status: 'PRESENT', note: '' },
  { id: 2, attendance_session_id: 2, student_id: 'HS001', status: 'LATE', note: 'Đi trễ 10 phút' },
  { id: 3, attendance_session_id: 3, student_id: 'HS001', status: 'ABSENT_UNEXCUSED', note: 'Nghỉ không phép' }
];

// attendance_logs (dữ liệu vân tay)
const attendance_logs = [
  { id: 1, student_id: 'HS001', log_time: `${TODAY}T07:25:00`, log_type: 'IN' },
  { id: 2, student_id: 'HS001', log_time: `${TODAY}T08:40:00`, log_type: 'OUT' }
];
/* =============================================================== */

const getSubjectName = (subjectId) => {
  const s = subjects.find(x => x.id === subjectId);
  return s ? s.subject_name : 'N/A';
};

const getTeacherName = (teacherId) => {
  const t = teachers.find(x => x.id === teacherId);
  return t ? t.full_name : 'N/A';
};

const timetable_today_view = (() => {
  const dayOfWeek = 1; // cố định cho mock TODAY
  return timetable_entries
    .filter(e => e.date_of_week === dayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .map(e => ({
      id: e.id,
      start_time: e.start_time,
      end_time: e.end_time,
      subject_name: getSubjectName(e.subject_id),
      teacher_name: getTeacherName(e.teacher_id)
    }));
})();

const attendance_view = attendance_records.map(r => {
  const session = attendance_sessions.find(s => s.id === r.attendance_session_id);
  const entry = session ? timetable_entries.find(e => e.id === session.timetable_entry_id) : null;
  return {
    id: r.id,
    subject_name: entry ? getSubjectName(entry.subject_id) : 'N/A',
    session_date: session ? session.session_date : '',
    status: r.status,
    note: r.note
  };
}).sort((a, b) => b.session_date.localeCompare(a.session_date));

const toDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
};

const getTodayCheckinCheckout = () => {
  const todayLogs = attendance_logs
    .filter(l => l.log_time.startsWith(TODAY))
    .sort((a, b) => a.log_time.localeCompare(b.log_time));
  if (!todayLogs.length) {
    return { checkin: null, checkout: null };
  }
  const firstIn = todayLogs.find(l => l.log_type === 'IN');
  const lastOut = [...todayLogs].reverse().find(l => l.log_type === 'OUT');
  const toHHMM = (iso) => (iso ? iso.split('T')[1]?.slice(0, 5) : null);
  return {
    checkin: toHHMM(firstIn?.log_time),
    checkout: toHHMM(lastOut?.log_time)
  };
};

/* ================= COMPONENT ================= */

const ParentDashboard = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (key) => {
    if (onNavigate) {
      onNavigate(key);
      return;
    }
    switch (key) {
      case 'timetable':
        navigate('/parent/timetable');
        break;
      case 'attendance':
        navigate('/parent/attendance');
        break;
      case 'leave':
        navigate('/parent/leave');
        break;
      case 'student':
        navigate('/parent/student');
        break;
      case 'notifications':
        navigate('/parent/notifications');
        break;
      default:
        break;
    }
  };

  const currentStudent = students[0];
  const currentClass = classes.find(c => c.id === currentStudent.class_id);
  const currentYear = academic_years.find(y => y.id === currentClass?.academic_year_id);

  const presentCount = attendance_records.filter(a => a.status === 'PRESENT').length;
  const lateCount = attendance_records.filter(a => a.status === 'LATE').length;
  const absentCount = attendance_records.filter(a =>
    a.status === 'ABSENT_EXCUSED' || a.status === 'ABSENT_UNEXCUSED'
  ).length;

  const todayAttendance = getTodayCheckinCheckout();

  return (
    <div className="dashboard">
      {/* TOP */}
      <div className="dashboard-top">
        <div className="attendance-today">
          <div className="attendance-header">
            <div className="icon-box emerald">
              <FaFingerprint width={32} height={32} />
            </div>
            <div>
              <h4>Chuyên cần hôm nay</h4>
              <p>Hôm nay: {toDisplayDate(TODAY)}</p>
            </div>
          </div>

          <div className="attendance-info">
            <div className="info-row">
              <span>Vào trường</span>
              <strong>{todayAttendance.checkin ? `${todayAttendance.checkin}` : '--:--'}</strong>
            </div>
            <div className="info-row">
              <span>Rời trường</span>
              <em>{todayAttendance.checkout ? todayAttendance.checkout : '--:--'}</em>
            </div>
            <div className="status-live">
              <span className="dot" />
              <span>
                {todayAttendance.checkin && !todayAttendance.checkout
                  ? 'Đang học tại trường'
                  : todayAttendance.checkout
                    ? 'Đã rời trường'
                    : 'Chưa điểm danh hôm nay'}
              </span>
            </div>
          </div>
        </div>

        <div className="welcome-card">
          <h2>Chào buổi sáng, phụ huynh!</h2>
          <p>
            Hôm nay {currentStudent.full_name} có {timetable_today_view.length} tiết học.
            Đừng quên kiểm tra thông báo mới từ nhà trường.
          </p>

          <div className="class-info">
            <div>
              <small>Lớp học</small>
              <strong>{currentClass?.class_name}</strong>
            </div>
            <div>
              <small>Năm học</small>
              <strong>{currentYear?.name}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <FaCheckCircle className="icon green" />
          <div>
            <small>Có mặt</small>
            <strong>{presentCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaClock className="icon amber" />
          <div>
            <small>Đi muộn</small>
            <strong>{lateCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaExclamationCircle className="icon rose" />
          <div>
            <small>Vắng mặt</small>
            <strong>{absentCount} buổi</strong>
          </div>
        </div>

        <div className="stat-card">
          <FaCalendarAlt className="icon emerald" />
          <div>
            <small>Hôm nay</small>
            <strong>{timetable_today_view.length} tiết</strong>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="dashboard-bottom">
        <div className="timetable">
          <div className="card-header">
            <h4>Lịch học tiếp theo</h4>
            <button className="btn" onClick={() => handleNavigate('timetable')}>Xem tất cả</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tiết</th>
                <th>Thời gian</th>
                <th>Môn học</th>
                <th>Giáo viên</th>
              </tr>
            </thead>
            <tbody>
              {timetable_today_view.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.start_time} - {item.end_time}</td>
                  <td>{item.subject_name}</td>
                  <td>{item.teacher_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="attendance-recent">
          <h4>Điểm danh gần đây</h4>

          {attendance_view.map(item => (
            <div key={item.id} className="attendance-item">
              <span className={`dot ${item.status.toLowerCase()}`} />
              <div>
                <div className="row">
                  <strong>{item.subject_name}</strong>
                  <small>{toDisplayDate(item.session_date)}</small>
                </div>
                <div className="row">
                  <span className={`badge ${item.status.toLowerCase()}`}>
                    {item.status === 'PRESENT'
                      ? 'CÓ MẶT'
                      : item.status === 'LATE'
                        ? 'ĐI MUỘN'
                        : 'VẮNG'}
                  </span>
                  {item.note && <em>"{item.note}"</em>}
                </div>
              </div>
            </div>
          ))}

          <button className="btn" onClick={() => handleNavigate('attendance')}>
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
