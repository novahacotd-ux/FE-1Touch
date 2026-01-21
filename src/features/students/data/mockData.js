
// Generate more mock students
const MOCK_STUDENTS_INIT = [
  {
    id: "s1",
    student_code: "HS0001",
    full_name: "Nguyễn Minh Anh",
    gender: "F",
    dob: "2008-03-12",
    status: "ACTIVE",
    class_id: "c10a1",
    fingerprint_id: "FP_10021",
  },
  {
    id: "s2",
    student_code: "HS0002",
    full_name: "Trần Quốc Huy",
    gender: "M",
    dob: "2008-11-05",
    status: "ACTIVE",
    class_id: "c10a1",
    fingerprint_id: "", // missing
  },
  {
    id: "s3",
    student_code: "HS0003",
    full_name: "Lê Thu Trang",
    gender: "F",
    dob: "2007-07-22",
    status: "ACTIVE",
    class_id: "c11b2",
    fingerprint_id: "FP_10088",
  },
  {
    id: "s4",
    student_code: "HS0004",
    full_name: "Phạm Gia Bảo",
    gender: "M",
    dob: "2007-01-19",
    status: "ACTIVE",
    class_id: "c11b2",
    fingerprint_id: "FP_10088", // duplicate with s3
  },
  {
    id: "s5",
    student_code: "HS0005",
    full_name: "Đỗ Khánh Vy",
    gender: "F",
    dob: "2006-09-01",
    status: "ACTIVE",
    class_id: "c12c2",
    fingerprint_id: "FP_10111",
  },
  {
    id: "s6",
    student_code: "HS0006",
    full_name: "Bùi Đức Long",
    gender: "M",
    dob: "2008-02-14",
    status: "TRANSFERRED",
    class_id: "c10a2",
    fingerprint_id: "FP_10222",
  },
  {
    id: "s7",
    student_code: "HS0007",
    full_name: "Võ Tuấn Kiệt",
    gender: "M",
    dob: "2008-04-20",
    status: "ACTIVE",
    class_id: "c10a2",
    fingerprint_id: "FP_10333",
  },
  {
    id: "s8",
    student_code: "HS0008",
    full_name: "Ngô Bảo Ngọc",
    gender: "F",
    dob: "2006-12-30",
    status: "INACTIVE",
    class_id: "c12c1",
    fingerprint_id: "",
  },
];

for (let i = 9; i <= 60; i++) {
  const pad = i.toString().padStart(4, "0");
  const cls = ["c10a1", "c10a2", "c11b1", "c11b2", "c12c1", "c12c2"][Math.floor(Math.random() * 6)];
  const status = Math.random() > 0.9 ? "INACTIVE" : Math.random() > 0.85 ? "TRANSFERRED" : "ACTIVE";
  MOCK_STUDENTS_INIT.push({
    id: `s${i}`,
    student_code: `HS${pad}`,
    full_name: `Học sinh Mock ${i}`,
    gender: Math.random() > 0.5 ? "M" : "F",
    dob: "2007-01-01",
    status,
    class_id: cls,
    fingerprint_id: Math.random() > 0.8 ? "" : `FP_MOCK_${i}`,
  });
}

export const MOCK_USERS = [
  {
    id: "u_admin",
    username: "admin",
    password: "admin123", // mock
    full_name: "Admin",
    email: "admin@school.vn",
    phone: "0900000000",
    role: "ADMIN", // ADMIN | TEACHER | PARENT
    status: "ACTIVE", // ACTIVE | LOCKED
    login_method: "PASSWORD", // PASSWORD | OTP
    created_at: "2026-01-01 08:00",
    updated_at: "2026-01-01 08:00",
  },
  {
    id: "u_p1",
    username: "parent_hong",
    password: "temp12345",
    full_name: "Nguyễn Thị Hồng",
    email: "",
    phone: "0901 000 111",
    role: "PARENT",
    status: "ACTIVE",
    login_method: "OTP",
    created_at: "2026-01-10 10:00",
    updated_at: "2026-01-10 10:00",
  },
  {
    id: "u_p4",
    username: "parent_khang",
    password: "temp12345",
    full_name: "Đỗ Văn Khang",
    email: "",
    phone: "0909 111 222",
    role: "PARENT",
    status: "ACTIVE",
    login_method: "PASSWORD",
    created_at: "2026-01-10 10:00",
    updated_at: "2026-01-10 10:00",
  },
];

export const MOCK_CLASSES = [
  { id: "c10a1", name: "10A1" },
  { id: "c10a2", name: "10A2" },
  { id: "c11b1", name: "11B1" },
  { id: "c11b2", name: "11B2" },
  { id: "c12c1", name: "12C1" },
  { id: "c12c2", name: "12C2" },
];

export const MOCK_STUDENTS = MOCK_STUDENTS_INIT;

export const MOCK_PARENTS = [
  {
    id: "p1",
    user_id: "u_p1",       // ✅ link to users
    student_id: "s1",
    full_name: "Nguyễn Thị Hồng",
    phone: "0901 000 111",
    zalo_id: "zalo_hong_01",
    is_primary: true,
  },
  {
    id: "p2",
    user_id: null,         // ✅ chưa có tài khoản
    student_id: "s1",
    full_name: "Nguyễn Văn Nam",
    phone: "0902 000 222",
    zalo_id: "",
    is_primary: false,
  },
  {
    id: "p3",
    user_id: null,
    student_id: "s2",
    full_name: "Trần Thị Mai",
    phone: "",
    zalo_id: "",
    is_primary: true,
  },
  {
    id: "p4",
    user_id: "u_p4",
    student_id: "s5",
    full_name: "Đỗ Văn Khang",
    phone: "0909 111 222",
    zalo_id: "zalo_khang_02",
    is_primary: true,
  },
];

// Attendance sessions (per period) - simple mock
export const MOCK_SESSIONS = [
  { id: "as1", session_date: "2026-01-15", start_time: "07:30", end_time: "08:15" },
  { id: "as2", session_date: "2026-01-15", start_time: "08:25", end_time: "09:10" },
  { id: "as3", session_date: "2026-01-16", start_time: "07:30", end_time: "08:15" },
  { id: "as4", session_date: "2026-01-16", start_time: "08:25", end_time: "09:10" },
  { id: "as5", session_date: "2026-01-17", start_time: "07:30", end_time: "08:15" },
];

export const MOCK_RECORDS = [
  // s1 - normal
  { id: "r1", attendance_session_id: "as1", student_id: "s1", status: "PRESENT", note: "" },
  { id: "r2", attendance_session_id: "as2", student_id: "s1", status: "LATE", note: "kẹt xe" },
  { id: "r3", attendance_session_id: "as3", student_id: "s1", status: "PRESENT", note: "" },
  // s2 - missing fingerprint => many absences
  { id: "r4", attendance_session_id: "as1", student_id: "s2", status: "ABSENT_UNEXCUSED", note: "" },
  { id: "r5", attendance_session_id: "as2", student_id: "s2", status: "ABSENT_UNEXCUSED", note: "" },
  { id: "r6", attendance_session_id: "as3", student_id: "s2", status: "ABSENT_EXCUSED", note: "bệnh" },
  // s3 / s4 duplicate fingerprint -> suspicious mixed
  { id: "r7", attendance_session_id: "as1", student_id: "s3", status: "PRESENT", note: "" },
  { id: "r8", attendance_session_id: "as2", student_id: "s3", status: "PRESENT", note: "" },
  { id: "r9", attendance_session_id: "as1", student_id: "s4", status: "ABSENT_UNEXCUSED", note: "" },
  { id: "r10", attendance_session_id: "as2", student_id: "s4", status: "LATE", note: "" },
  // s5 late often
  { id: "r11", attendance_session_id: "as1", student_id: "s5", status: "LATE", note: "" },
  { id: "r12", attendance_session_id: "as2", student_id: "s5", status: "LATE", note: "" },
  { id: "r13", attendance_session_id: "as3", student_id: "s5", status: "PRESENT", note: "" },
];

export const MOCK_LOGS = [
  // s1 logs
  { id: "l1", student_id: "s1", log_time: "2026-01-15 07:22", log_type: "IN" },
  { id: "l2", student_id: "s1", log_time: "2026-01-15 16:35", log_type: "OUT" },
  { id: "l3", student_id: "s1", log_time: "2026-01-16 07:25", log_type: "IN" },
  // s5 logs
  { id: "l4", student_id: "s5", log_time: "2026-01-15 07:48", log_type: "IN" },
  { id: "l5", student_id: "s5", log_time: "2026-01-16 07:46", log_type: "IN" },
  // s3 logs (same fingerprint as s4 -> suspicious but logs are per student_id)
  { id: "l6", student_id: "s3", log_time: "2026-01-15 07:20", log_type: "IN" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", student_id: "s2", parent_id: "p3", message: "HS vắng không phép", sent_at: "2026-01-15 09:30", status: "FAILED" },
  { id: "n2", student_id: "s2", parent_id: "p3", message: "HS vắng không phép", sent_at: "2026-01-16 09:30", status: "SENT" },
  { id: "n3", student_id: "s5", parent_id: "p4", message: "HS đi muộn", sent_at: "2026-01-15 08:00", status: "SENT" },
];
