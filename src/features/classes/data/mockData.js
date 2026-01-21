import { clamp } from "../utils/classHelpers";

export const MOCK_ACADEMIC_YEARS = [
  {
    id: "ay_2023",
    name: "2023-2024",
    start_date: "2023-09-01",
    end_date: "2024-05-31",
    is_current: false,
  },
  {
    id: "ay_2024",
    name: "2024-2025",
    start_date: "2024-09-01",
    end_date: "2025-05-31",
    is_current: true,
  },
  {
    id: "ay_2025",
    name: "2025-2026",
    start_date: "2025-09-01",
    end_date: "2026-05-31",
    is_current: false,
  },
];

export const MOCK_GRADES = [
  { id: "g10", grade_name: "10" },
  { id: "g11", grade_name: "11" },
  { id: "g12", grade_name: "12" },
];

export function nextGradeId(currentGradeId) {
    const idx = MOCK_GRADES.findIndex((g) => g.id === currentGradeId);
    if (idx < 0) return currentGradeId;
    const nextIdx = clamp(idx + 1, 0, MOCK_GRADES.length - 1);
    return MOCK_GRADES[nextIdx].id;
}

export const MOCK_USERS = [
  {
    id: "u1",
    username: "t.nguyen",
    full_name: "Nguyễn Thanh Tùng",
    email: "tung.nguyen@school.vn",
    phone: "0901000111",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-08-10 09:12",
    updated_at: "2026-01-10 10:02",
  },
  {
    id: "u2",
    username: "h.le",
    full_name: "Lê Thị Hải",
    email: "hai.le@school.vn",
    phone: "0902000222",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-08-11 14:21",
    updated_at: "2026-01-12 08:30",
  },
  {
    id: "u3",
    username: "p.tran",
    full_name: "Trần Minh Phúc",
    email: "phuc.tran@school.vn",
    phone: "0903000333",
    role: "TEACHER",
    status: "LOCKED",
    created_at: "2025-08-12 10:05",
    updated_at: "2026-01-15 16:40",
  },
  {
    id: "u4",
    username: "l.do",
    full_name: "Đỗ Linh",
    email: "linh.do@school.vn",
    phone: "0904000444",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-08-12 11:07",
    updated_at: "2026-01-14 09:10",
  },
  {
    id: "u5",
    username: "q.pham",
    full_name: "Phạm Quốc Quân",
    email: "quan.pham@school.vn",
    phone: "0905000555",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-08-13 15:45",
    updated_at: "2026-01-16 07:55",
  },
  {
    id: "u6",
    username: "m.vu",
    full_name: "Vũ Minh Mỹ",
    email: "my.vu@school.vn",
    phone: "0906000666",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-08-15 08:12",
    updated_at: "2026-01-16 09:20",
  },
  {
    id: "u7",
    username: "k.hoang",
    full_name: "Hoàng Khánh",
    email: "khanh.hoang@school.vn",
    phone: "0907000777",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-09-01 09:00",
    updated_at: "2026-01-05 11:11",
  },
  {
    id: "u8",
    username: "n.bui",
    full_name: "Bùi Ngọc",
    email: "ngoc.bui@school.vn",
    phone: "0908000888",
    role: "TEACHER",
    status: "ACTIVE", // làm cho dữ liệu “thật” hơn (khớp UNLOCK log)
    created_at: "2025-09-05 13:20",
    updated_at: "2026-01-03 08:40",
  },
  {
    id: "u9",
    username: "d.ngo",
    full_name: "Ngô Đức",
    email: "duc.ngo@school.vn",
    phone: "0909000999",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-10-10 10:10",
    updated_at: "2026-01-09 17:00",
  },
  {
    id: "u10",
    username: "a.truong",
    full_name: "Trương An",
    email: "an.truong@school.vn",
    phone: "0910000100",
    role: "TEACHER",
    status: "ACTIVE",
    created_at: "2025-10-11 10:10",
    updated_at: "2026-01-10 17:00",
  },
];

export const MOCK_TEACHERS = [
  { id: "t1", user_id: "u1", teacher_code: "GV001", is_active: true },
  { id: "t2", user_id: "u2", teacher_code: "GV002", is_active: true },
  { id: "t3", user_id: "u3", teacher_code: "GV003", is_active: false },
  { id: "t4", user_id: "u4", teacher_code: "GV004", is_active: true },
  { id: "t5", user_id: "u5", teacher_code: "GV005", is_active: true },
  { id: "t6", user_id: "u6", teacher_code: "GV006", is_active: true },
  { id: "t7", user_id: "u7", teacher_code: "GV007", is_active: true },
  { id: "t8", user_id: "u8", teacher_code: "GV008", is_active: true },
  { id: "t9", user_id: "u9", teacher_code: "GV009", is_active: true },
  { id: "t10", user_id: "u10", teacher_code: "GV010", is_active: true },
];

export const MOCK_CLASSES = [
  { id: "c10a1", class_name: "10A1", grade_id: "g10", academic_year_id: "ay_2024", status: "OPEN" },
  { id: "c10a2", class_name: "10A2", grade_id: "g10", academic_year_id: "ay_2024", status: "OPEN" },
  { id: "c11b1", class_name: "11B1", grade_id: "g11", academic_year_id: "ay_2024", status: "OPEN" },
  { id: "c11b2", class_name: "11B2", grade_id: "g11", academic_year_id: "ay_2024", status: "OPEN" },
  { id: "c12c1", class_name: "12C1", grade_id: "g12", academic_year_id: "ay_2024", status: "OPEN" },
  { id: "c12c2", class_name: "12C2", grade_id: "g12", academic_year_id: "ay_2024", status: "CLOSED" }, // ví dụ lớp đóng
];

export const MOCK_TEACHER_ASSIGNMENTS = [
  // HOMEROOM (GVCN)
  { id: "ta1", teacher_id: "t2", class_id: "c10a1", subject_id: "sub_van", role: "HOMEROOM" },
  { id: "ta2", teacher_id: "t4", class_id: "c11b1", subject_id: "sub_hoa", role: "HOMEROOM" },
  { id: "ta3", teacher_id: "t6", class_id: "c12c2", subject_id: "sub_toan", role: "HOMEROOM" },
  // SUBJECT (bộ môn) — không dùng sâu ở tab lớp, nhưng giữ đúng ERD
  { id: "ta4", teacher_id: "t1", class_id: "c10a1", subject_id: "sub_toan", role: "SUBJECT" },
  { id: "ta5", teacher_id: "t5", class_id: "c10a2", subject_id: "sub_anh", role: "SUBJECT" },
  { id: "ta6", teacher_id: "t7", class_id: "c12c1", subject_id: "sub_van", role: "SUBJECT" },
];

export const MOCK_STUDENT_ROLES = [
  { id: "sr_leader", role_code: "LEADER", role_name: "Lớp trưởng" },
  { id: "sr_vice", role_code: "VICE_LEADER", role_name: "Lớp phó" },
  { id: "sr_none", role_code: "NONE", role_name: "Thành viên" },
];

const genStudents = () => {
    const base = [
      { code: "HS1001", name: "Nguyễn Minh Anh" },
      { code: "HS1002", name: "Trần Gia Huy" },
      { code: "HS1003", name: "Phạm Thùy Dương" },
      { code: "HS1004", name: "Lê Hoàng Nam" },
      { code: "HS1005", name: "Vũ Ngọc Hà" },
      { code: "HS1006", name: "Đỗ Quang Hưng" },
      { code: "HS1007", name: "Bùi Thanh Tâm" },
      { code: "HS1008", name: "Ngô Khánh Linh" },
      { code: "HS1009", name: "Hoàng Đức Anh" },
      { code: "HS1010", name: "Trương Bảo Ngọc" },
      { code: "HS1011", name: "Nguyễn Tuấn Kiệt" },
      { code: "HS1012", name: "Trần Thị Mai" },
      { code: "HS1013", name: "Phạm Minh Quân" },
      { code: "HS1014", name: "Lê Thảo Vy" },
      { code: "HS1015", name: "Vũ Hải Đăng" },
      { code: "HS1016", name: "Đỗ Minh Châu" },
      { code: "HS1017", name: "Bùi Quốc Khánh" },
      { code: "HS1018", name: "Ngô Thùy Trang" },
      { code: "HS1019", name: "Hoàng Nhật Long" },
      { code: "HS1020", name: "Trương Gia Bảo" },
      { code: "HS1021", name: "Nguyễn Quỳnh Anh" },
      { code: "HS1022", name: "Trần Minh Khoa" },
      { code: "HS1023", name: "Phạm Ngọc Bích" },
      { code: "HS1024", name: "Lê Thanh Sơn" },
      { code: "HS1025", name: "Vũ Thu Phương" },
      { code: "HS1026", name: "Đỗ Văn Phúc" },
      { code: "HS1027", name: "Bùi Minh Hằng" },
      { code: "HS1028", name: "Ngô Quốc Việt" },
    ];
  
    const classIds = ["c10a1", "c10a2", "c11b1", "c11b2", "c12c1", "c12c2"];
    const statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "TRANSFERRED", "INACTIVE"]; // skew realistic
  
    const out = [];
    let idx = 0;
    for (const cid of classIds) {
      const n = cid === "c12c2" ? 20 : 18; // lớp 12C2 đông hơn (demo)
      for (let j = 0; j < n; j++) {
        const b = base[idx % base.length];
        const status = statuses[(idx + j) % statuses.length];
        out.push({
          id: `s_${cid}_${j + 1}`,
          student_code: `${b.code}-${String(j + 1).padStart(2, "0")}`,
          full_name: b.name,
          class_id: cid,
          student_role_id:
            j === 0 ? "sr_leader" : j === 1 ? "sr_vice" : "sr_none",
          status,
          fingerprint_id: Math.random() > 0.1 ? `fp_${cid}_${j + 1}` : null, // 10% missing fingerprint
        });
        idx++;
      }
    }
    // Add some "free" students (no class)
    out.push(
      { id: "s_free_1", student_code: "HS8888", full_name: "Nguyễn Văn Tự Do", class_id: null, student_role_id: "sr_none", status: "ACTIVE" },
      { id: "s_free_2", student_code: "HS9999", full_name: "Lê Thị Chưa Lớp", class_id: null, student_role_id: "sr_none", status: "ACTIVE" },
      { id: "s_free_3", student_code: "HS7777", full_name: "Trần Không Lớp", class_id: null, student_role_id: "sr_none", status: "ACTIVE" }
    );

    return out;
  };

export const MOCK_STUDENTS = genStudents();

export const MOCK_AUDIT_LOGS = [
  { id: "al1", user_id: "admin", action: "CLOSE_CLASS", entity: "classes", entity_id: "c12c2", created_at: "2026-01-15 16:40" },
  { id: "al2", user_id: "admin", action: "UPDATE_CLASS", entity: "classes", entity_id: "c11b2", created_at: "2026-01-16 07:55" },
  { id: "al3", user_id: "admin", action: "ASSIGN_HOMEROOM", entity: "teacher_assignments", entity_id: "ta2", created_at: "2026-01-12 08:30" },
  { id: "al4", user_id: "admin", action: "PROMOTE_YEAR_PREVIEW", entity: "classes", entity_id: "batch_01", created_at: "2026-01-14 09:10" },
  { id: "al5", user_id: "admin", action: "EXPORT_CLASSES", entity: "excel", entity_id: "exp_01", created_at: "2026-01-03 08:40" },
];

export const MOCK_TIMETABLES = [
  { id: "tt1", class_id: "c10a1", academic_year_id: "ay_2024", effective_from: "2024-09-01", effective_to: "2025-05-31" },
  { id: "tt2", class_id: "c11b1", academic_year_id: "ay_2024", effective_from: "2024-09-01", effective_to: "2025-05-31" },
  { id: "tt3", class_id: "c12c1", academic_year_id: "ay_2024", effective_from: "2024-09-01", effective_to: "2025-05-31" },
  { id: "tt4", class_id: "c12c2", academic_year_id: "ay_2024", effective_from: "2024-09-01", effective_to: "2025-05-31" },
];

export const MOCK_TIMETABLE_ENTRIES = [
  { id: "tte1", timetable_id: "tt1", day_of_week: 2, start_time: "07:00", end_time: "07:45", subject_id: "sub_toan" },
  { id: "tte2", timetable_id: "tt1", day_of_week: 2, start_time: "07:50", end_time: "08:35", subject_id: "sub_van" },
  { id: "tte3", timetable_id: "tt2", day_of_week: 2, start_time: "07:00", end_time: "07:45", subject_id: "sub_hoa" },
  { id: "tte4", timetable_id: "tt4", day_of_week: 2, start_time: "07:00", end_time: "07:45", subject_id: "sub_ly" }, // 12C2 specific
];

const genAttendance = () => {
  const records = [];
  const targetClasses = ["c12c2", "c11b1", "c12c1", "c10a1"]; 
  const dates = ["2026-01-14", "2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18", "2026-01-19", "2026-01-20"];
  
  targetClasses.forEach(cid => {
    const stus = MOCK_STUDENTS.filter(s => s.class_id === cid);
    const isBadClass = cid === "c12c2"; 
    
    dates.forEach(date => {
      // 2 sessions/day
      ["07:00", "08:00"].forEach((time, idx) => {
        const sessId = `sess_${cid}_${date}_${idx}`;
        stus.forEach(s => {
           let status = "PRESENT";
           const rand = Math.random();
           // Logic to create Hotspots
           if (isBadClass) {
             if (rand < 0.25) status = "LATE";
             else if (rand < 0.35) status = "ABSENT_UNEXCUSED";
           } else if (cid === "c11b1") { // Moderate issues
             if (rand < 0.1) status = "LATE";
           }
           
           records.push({
             id: `rec_${sessId}_${s.id}`,
             attendance_session_id: sessId,
             student_id: s.id,
             date: date,
             start_time: time, 
             status: status
           });
        });
      });
    });
  });
  return records;
};

export const MOCK_ATTENDANCE_RECORDS = genAttendance();
