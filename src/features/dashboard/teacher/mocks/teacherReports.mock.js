// teacherReports.mock.js
// Mock data following ERD: classes, students, attendance_records
// Semester: HK2 2025-2026 (100 buổi)

// ─── CLASSES ────────────────────────────────────────────

export const classes = [
    { id: 1, class_name: '6A', grade: 6, homeroom_teacher: 'Nguyễn Thị Hương', total_students: 35 },
    { id: 2, class_name: '6B', grade: 6, homeroom_teacher: 'Trần Văn Nam', total_students: 35 },
    { id: 3, class_name: '7A', grade: 7, homeroom_teacher: 'Lê Thị Mai', total_students: 38 },
    { id: 4, class_name: '7B', grade: 7, homeroom_teacher: 'Phạm Văn Đức', total_students: 36 },
];

// ─── STUDENTS ───────────────────────────────────────────
// Each student has semester totals (out of 100 sessions)

export const students = [
    // ── Lớp 6A (35 HS) ──
    { id: 101, class_id: 1, class_name: '6A', student_code: 'HS6A01', full_name: 'Nguyễn Văn Anh', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 102, class_id: 1, class_name: '6A', student_code: 'HS6A02', full_name: 'Trần Thị Bảo', gender: 'FEMALE', present: 97, late: 2, absent_unexcused: 1, absent_excused: 0 },
    { id: 103, class_id: 1, class_name: '6A', student_code: 'HS6A03', full_name: 'Lê Văn Cao', gender: 'MALE', present: 95, late: 3, absent_unexcused: 1, absent_excused: 1 },
    { id: 104, class_id: 1, class_name: '6A', student_code: 'HS6A04', full_name: 'Phạm Thị Duyên', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 105, class_id: 1, class_name: '6A', student_code: 'HS6A05', full_name: 'Hoàng Văn Đức', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 106, class_id: 1, class_name: '6A', student_code: 'HS6A06', full_name: 'Ngô Thị Hà', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 107, class_id: 1, class_name: '6A', student_code: 'HS6A07', full_name: 'Đỗ Văn Hải', gender: 'MALE', present: 93, late: 2, absent_unexcused: 3, absent_excused: 2 },
    { id: 108, class_id: 1, class_name: '6A', student_code: 'HS6A08', full_name: 'Vũ Thị Hoa', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 1, absent_excused: 0 },
    { id: 109, class_id: 1, class_name: '6A', student_code: 'HS6A09', full_name: 'Bùi Văn Hùng', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 110, class_id: 1, class_name: '6A', student_code: 'HS6A10', full_name: 'Đinh Thị Kim', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 111, class_id: 1, class_name: '6A', student_code: 'HS6A11', full_name: 'Trương Văn Lâm', gender: 'MALE', present: 94, late: 2, absent_unexcused: 2, absent_excused: 2 },
    { id: 112, class_id: 1, class_name: '6A', student_code: 'HS6A12', full_name: 'Lý Thị Linh', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 1, absent_excused: 0 },
    { id: 113, class_id: 1, class_name: '6A', student_code: 'HS6A13', full_name: 'Đặng Văn Minh', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 114, class_id: 1, class_name: '6A', student_code: 'HS6A14', full_name: 'Phan Thị My', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 115, class_id: 1, class_name: '6A', student_code: 'HS6A15', full_name: 'Hồ Văn Nam', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 116, class_id: 1, class_name: '6A', student_code: 'HS6A16', full_name: 'Dương Thị Nga', gender: 'FEMALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 117, class_id: 1, class_name: '6A', student_code: 'HS6A17', full_name: 'Tô Văn Nhật', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 118, class_id: 1, class_name: '6A', student_code: 'HS6A18', full_name: 'Châu Thị Oanh', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 119, class_id: 1, class_name: '6A', student_code: 'HS6A19', full_name: 'Võ Văn Phú', gender: 'MALE', present: 93, late: 3, absent_unexcused: 3, absent_excused: 1 },
    { id: 120, class_id: 1, class_name: '6A', student_code: 'HS6A20', full_name: 'Lương Thị Quỳnh', gender: 'FEMALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 121, class_id: 1, class_name: '6A', student_code: 'HS6A21', full_name: 'Huỳnh Văn Sơn', gender: 'MALE', present: 96, late: 2, absent_unexcused: 1, absent_excused: 1 },
    { id: 122, class_id: 1, class_name: '6A', student_code: 'HS6A22', full_name: 'Mai Thị Thanh', gender: 'FEMALE', present: 99, late: 1, absent_unexcused: 0, absent_excused: 0 },
    { id: 123, class_id: 1, class_name: '6A', student_code: 'HS6A23', full_name: 'Cao Văn Trung', gender: 'MALE', present: 94, late: 1, absent_unexcused: 3, absent_excused: 2 },
    { id: 124, class_id: 1, class_name: '6A', student_code: 'HS6A24', full_name: 'Đoàn Thị Uyên', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 125, class_id: 1, class_name: '6A', student_code: 'HS6A25', full_name: 'Tạ Văn Vinh', gender: 'MALE', present: 97, late: 2, absent_unexcused: 1, absent_excused: 0 },
    { id: 126, class_id: 1, class_name: '6A', student_code: 'HS6A26', full_name: 'Kiều Thị Xuân', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 127, class_id: 1, class_name: '6A', student_code: 'HS6A27', full_name: 'Lại Văn Yên', gender: 'MALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 128, class_id: 1, class_name: '6A', student_code: 'HS6A28', full_name: 'Trịnh Thị Ánh', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 129, class_id: 1, class_name: '6A', student_code: 'HS6A29', full_name: 'Thái Văn Bằng', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 130, class_id: 1, class_name: '6A', student_code: 'HS6A30', full_name: 'Quách Thị Cúc', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 131, class_id: 1, class_name: '6A', student_code: 'HS6A31', full_name: 'Mạc Văn Dũng', gender: 'MALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 132, class_id: 1, class_name: '6A', student_code: 'HS6A32', full_name: 'La Thị Giang', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 133, class_id: 1, class_name: '6A', student_code: 'HS6A33', full_name: 'Từ Văn Hiếu', gender: 'MALE', present: 91, late: 2, absent_unexcused: 5, absent_excused: 2 },
    { id: 134, class_id: 1, class_name: '6A', student_code: 'HS6A34', full_name: 'Ông Thị Khánh', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 135, class_id: 1, class_name: '6A', student_code: 'HS6A35', full_name: 'Nông Văn Luận', gender: 'MALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },

    // ── Lớp 6B (35 HS) ──
    { id: 1, class_id: 2, class_name: '6B', student_code: 'HS6B01', full_name: 'Nguyễn Văn An', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 2, class_id: 2, class_name: '6B', student_code: 'HS6B02', full_name: 'Trần Thị Bình', gender: 'FEMALE', present: 95, late: 3, absent_unexcused: 1, absent_excused: 1 },
    { id: 3, class_id: 2, class_name: '6B', student_code: 'HS6B03', full_name: 'Lê Văn Cường', gender: 'MALE', present: 90, late: 4, absent_unexcused: 4, absent_excused: 2 },
    { id: 4, class_id: 2, class_name: '6B', student_code: 'HS6B04', full_name: 'Phạm Thị Dung', gender: 'FEMALE', present: 93, late: 1, absent_unexcused: 3, absent_excused: 3 },
    { id: 5, class_id: 2, class_name: '6B', student_code: 'HS6B05', full_name: 'Hoàng Văn Em', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 6, class_id: 2, class_name: '6B', student_code: 'HS6B06', full_name: 'Ngô Thị Phương', gender: 'FEMALE', present: 82, late: 3, absent_unexcused: 10, absent_excused: 5 },
    { id: 7, class_id: 2, class_name: '6B', student_code: 'HS6B07', full_name: 'Đỗ Văn Giang', gender: 'MALE', present: 96, late: 2, absent_unexcused: 1, absent_excused: 1 },
    { id: 8, class_id: 2, class_name: '6B', student_code: 'HS6B08', full_name: 'Vũ Thị Hương', gender: 'FEMALE', present: 76, late: 2, absent_unexcused: 14, absent_excused: 8 },
    { id: 9, class_id: 2, class_name: '6B', student_code: 'HS6B09', full_name: 'Bùi Văn Khoa', gender: 'MALE', present: 94, late: 4, absent_unexcused: 1, absent_excused: 1 },
    { id: 10, class_id: 2, class_name: '6B', student_code: 'HS6B10', full_name: 'Đinh Thị Lan', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 11, class_id: 2, class_name: '6B', student_code: 'HS6B11', full_name: 'Trương Văn Long', gender: 'MALE', present: 78, late: 5, absent_unexcused: 12, absent_excused: 5 },
    { id: 12, class_id: 2, class_name: '6B', student_code: 'HS6B12', full_name: 'Lý Thị Mai', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 13, class_id: 2, class_name: '6B', student_code: 'HS6B13', full_name: 'Đặng Văn Nghĩa', gender: 'MALE', present: 96, late: 2, absent_unexcused: 1, absent_excused: 1 },
    { id: 14, class_id: 2, class_name: '6B', student_code: 'HS6B14', full_name: 'Phan Thị Oanh', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 15, class_id: 2, class_name: '6B', student_code: 'HS6B15', full_name: 'Hồ Văn Phúc', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 16, class_id: 2, class_name: '6B', student_code: 'HS6B16', full_name: 'Dương Thị Quỳnh', gender: 'FEMALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 17, class_id: 2, class_name: '6B', student_code: 'HS6B17', full_name: 'Tô Văn Sáng', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 18, class_id: 2, class_name: '6B', student_code: 'HS6B18', full_name: 'Châu Thị Thanh', gender: 'FEMALE', present: 93, late: 3, absent_unexcused: 2, absent_excused: 2 },
    { id: 19, class_id: 2, class_name: '6B', student_code: 'HS6B19', full_name: 'Võ Văn Tuấn', gender: 'MALE', present: 99, late: 0, absent_unexcused: 1, absent_excused: 0 },
    { id: 20, class_id: 2, class_name: '6B', student_code: 'HS6B20', full_name: 'Lương Thị Uyên', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 21, class_id: 2, class_name: '6B', student_code: 'HS6B21', full_name: 'Huỳnh Văn Vinh', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 22, class_id: 2, class_name: '6B', student_code: 'HS6B22', full_name: 'Mai Thị Xuân', gender: 'FEMALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },
    { id: 23, class_id: 2, class_name: '6B', student_code: 'HS6B23', full_name: 'Cao Văn Yên', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 24, class_id: 2, class_name: '6B', student_code: 'HS6B24', full_name: 'Đoàn Thị Ánh', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 25, class_id: 2, class_name: '6B', student_code: 'HS6B25', full_name: 'Tạ Văn Bảo', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 26, class_id: 2, class_name: '6B', student_code: 'HS6B26', full_name: 'Kiều Thị Cẩm', gender: 'FEMALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 27, class_id: 2, class_name: '6B', student_code: 'HS6B27', full_name: 'Lại Văn Dương', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 28, class_id: 2, class_name: '6B', student_code: 'HS6B28', full_name: 'Trịnh Thị Hạnh', gender: 'FEMALE', present: 99, late: 1, absent_unexcused: 0, absent_excused: 0 },
    { id: 29, class_id: 2, class_name: '6B', student_code: 'HS6B29', full_name: 'Thái Văn Hiến', gender: 'MALE', present: 92, late: 3, absent_unexcused: 3, absent_excused: 2 },
    { id: 30, class_id: 2, class_name: '6B', student_code: 'HS6B30', full_name: 'Quách Thị Khánh', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 31, class_id: 2, class_name: '6B', student_code: 'HS6B31', full_name: 'Mạc Văn Lộc', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 32, class_id: 2, class_name: '6B', student_code: 'HS6B32', full_name: 'La Thị Mỹ', gender: 'FEMALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 33, class_id: 2, class_name: '6B', student_code: 'HS6B33', full_name: 'Từ Văn Nhân', gender: 'MALE', present: 91, late: 2, absent_unexcused: 5, absent_excused: 2 },
    { id: 34, class_id: 2, class_name: '6B', student_code: 'HS6B34', full_name: 'Ông Thị Phượng', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 35, class_id: 2, class_name: '6B', student_code: 'HS6B35', full_name: 'Nông Văn Quân', gender: 'MALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },

    // ── Lớp 7A (38 HS) ──
    { id: 201, class_id: 3, class_name: '7A', student_code: 'HS7A01', full_name: 'Nguyễn Văn Ân', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 202, class_id: 3, class_name: '7A', student_code: 'HS7A02', full_name: 'Trần Thị Bích', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 203, class_id: 3, class_name: '7A', student_code: 'HS7A03', full_name: 'Lê Văn Chiến', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 204, class_id: 3, class_name: '7A', student_code: 'HS7A04', full_name: 'Phạm Thị Diệu', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 205, class_id: 3, class_name: '7A', student_code: 'HS7A05', full_name: 'Hoàng Văn Đạt', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 206, class_id: 3, class_name: '7A', student_code: 'HS7A06', full_name: 'Ngô Thị Hạnh', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 207, class_id: 3, class_name: '7A', student_code: 'HS7A07', full_name: 'Đỗ Văn Hiếu', gender: 'MALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },
    { id: 208, class_id: 3, class_name: '7A', student_code: 'HS7A08', full_name: 'Vũ Thị Huệ', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 209, class_id: 3, class_name: '7A', student_code: 'HS7A09', full_name: 'Bùi Văn Kiên', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 210, class_id: 3, class_name: '7A', student_code: 'HS7A10', full_name: 'Đinh Thị Liên', gender: 'FEMALE', present: 96, late: 2, absent_unexcused: 1, absent_excused: 1 },
    { id: 211, class_id: 3, class_name: '7A', student_code: 'HS7A11', full_name: 'Trương Văn Mạnh', gender: 'MALE', present: 93, late: 1, absent_unexcused: 4, absent_excused: 2 },
    { id: 212, class_id: 3, class_name: '7A', student_code: 'HS7A12', full_name: 'Lý Thị Ngọc', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 1, absent_excused: 0 },
    { id: 213, class_id: 3, class_name: '7A', student_code: 'HS7A13', full_name: 'Đặng Văn Phong', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 214, class_id: 3, class_name: '7A', student_code: 'HS7A14', full_name: 'Phan Thị Quế', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 215, class_id: 3, class_name: '7A', student_code: 'HS7A15', full_name: 'Hồ Văn Sang', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 216, class_id: 3, class_name: '7A', student_code: 'HS7A16', full_name: 'Dương Thị Tâm', gender: 'FEMALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 217, class_id: 3, class_name: '7A', student_code: 'HS7A17', full_name: 'Tô Văn Thắng', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 218, class_id: 3, class_name: '7A', student_code: 'HS7A18', full_name: 'Châu Thị Vân', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 219, class_id: 3, class_name: '7A', student_code: 'HS7A19', full_name: 'Võ Văn Cương', gender: 'MALE', present: 88, late: 3, absent_unexcused: 6, absent_excused: 3 },
    { id: 220, class_id: 3, class_name: '7A', student_code: 'HS7A20', full_name: 'Lương Thị Dung', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 221, class_id: 3, class_name: '7A', student_code: 'HS7A21', full_name: 'Huỳnh Văn Hào', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 222, class_id: 3, class_name: '7A', student_code: 'HS7A22', full_name: 'Mai Thị Huyền', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 223, class_id: 3, class_name: '7A', student_code: 'HS7A23', full_name: 'Cao Văn Khải', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 224, class_id: 3, class_name: '7A', student_code: 'HS7A24', full_name: 'Đoàn Thị Lan', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 225, class_id: 3, class_name: '7A', student_code: 'HS7A25', full_name: 'Tạ Văn Nhân', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 226, class_id: 3, class_name: '7A', student_code: 'HS7A26', full_name: 'Kiều Thị Phượng', gender: 'FEMALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },
    { id: 227, class_id: 3, class_name: '7A', student_code: 'HS7A27', full_name: 'Lại Văn Quang', gender: 'MALE', present: 97, late: 0, absent_unexcused: 2, absent_excused: 1 },
    { id: 228, class_id: 3, class_name: '7A', student_code: 'HS7A28', full_name: 'Trịnh Thị Sen', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 229, class_id: 3, class_name: '7A', student_code: 'HS7A29', full_name: 'Thái Văn Tín', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 230, class_id: 3, class_name: '7A', student_code: 'HS7A30', full_name: 'Quách Thị Uyển', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 231, class_id: 3, class_name: '7A', student_code: 'HS7A31', full_name: 'Mạc Văn Vĩnh', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 232, class_id: 3, class_name: '7A', student_code: 'HS7A32', full_name: 'La Thị Yến', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 1, absent_excused: 0 },
    { id: 233, class_id: 3, class_name: '7A', student_code: 'HS7A33', full_name: 'Từ Văn Bình', gender: 'MALE', present: 93, late: 2, absent_unexcused: 3, absent_excused: 2 },
    { id: 234, class_id: 3, class_name: '7A', student_code: 'HS7A34', full_name: 'Ông Thị Châu', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 235, class_id: 3, class_name: '7A', student_code: 'HS7A35', full_name: 'Nông Văn Đại', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 236, class_id: 3, class_name: '7A', student_code: 'HS7A36', full_name: 'Lưu Thị Gấm', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 237, class_id: 3, class_name: '7A', student_code: 'HS7A37', full_name: 'Vương Văn Hưng', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 238, class_id: 3, class_name: '7A', student_code: 'HS7A38', full_name: 'Triệu Thị Kiều', gender: 'FEMALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },

    // ── Lớp 7B (36 HS) ──
    { id: 301, class_id: 4, class_name: '7B', student_code: 'HS7B01', full_name: 'Nguyễn Văn Ấn', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 302, class_id: 4, class_name: '7B', student_code: 'HS7B02', full_name: 'Trần Thị Bông', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 303, class_id: 4, class_name: '7B', student_code: 'HS7B03', full_name: 'Lê Văn Công', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 304, class_id: 4, class_name: '7B', student_code: 'HS7B04', full_name: 'Phạm Thị Đào', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 305, class_id: 4, class_name: '7B', student_code: 'HS7B05', full_name: 'Hoàng Văn Gia', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 306, class_id: 4, class_name: '7B', student_code: 'HS7B06', full_name: 'Ngô Thị Hằng', gender: 'FEMALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 307, class_id: 4, class_name: '7B', student_code: 'HS7B07', full_name: 'Đỗ Văn Hữu', gender: 'MALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },
    { id: 308, class_id: 4, class_name: '7B', student_code: 'HS7B08', full_name: 'Vũ Thị Huyền', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 309, class_id: 4, class_name: '7B', student_code: 'HS7B09', full_name: 'Bùi Văn Khánh', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 310, class_id: 4, class_name: '7B', student_code: 'HS7B10', full_name: 'Đinh Thị Lệ', gender: 'FEMALE', present: 96, late: 2, absent_unexcused: 1, absent_excused: 1 },
    { id: 311, class_id: 4, class_name: '7B', student_code: 'HS7B11', full_name: 'Trương Văn Minh', gender: 'MALE', present: 85, late: 3, absent_unexcused: 8, absent_excused: 4 },
    { id: 312, class_id: 4, class_name: '7B', student_code: 'HS7B12', full_name: 'Lý Thị Nhung', gender: 'FEMALE', present: 99, late: 0, absent_unexcused: 1, absent_excused: 0 },
    { id: 313, class_id: 4, class_name: '7B', student_code: 'HS7B13', full_name: 'Đặng Văn Phát', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 314, class_id: 4, class_name: '7B', student_code: 'HS7B14', full_name: 'Phan Thị Quyên', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 315, class_id: 4, class_name: '7B', student_code: 'HS7B15', full_name: 'Hồ Văn Sĩ', gender: 'MALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 316, class_id: 4, class_name: '7B', student_code: 'HS7B16', full_name: 'Dương Thị Thu', gender: 'FEMALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 317, class_id: 4, class_name: '7B', student_code: 'HS7B17', full_name: 'Tô Văn Trí', gender: 'MALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 318, class_id: 4, class_name: '7B', student_code: 'HS7B18', full_name: 'Châu Thị Vy', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 319, class_id: 4, class_name: '7B', student_code: 'HS7B19', full_name: 'Võ Văn Đăng', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 320, class_id: 4, class_name: '7B', student_code: 'HS7B20', full_name: 'Lương Thị Hà', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 321, class_id: 4, class_name: '7B', student_code: 'HS7B21', full_name: 'Huỳnh Văn Hoàng', gender: 'MALE', present: 99, late: 0, absent_unexcused: 0, absent_excused: 1 },
    { id: 322, class_id: 4, class_name: '7B', student_code: 'HS7B22', full_name: 'Mai Thị Ivy', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 323, class_id: 4, class_name: '7B', student_code: 'HS7B23', full_name: 'Cao Văn Khoa', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 324, class_id: 4, class_name: '7B', student_code: 'HS7B24', full_name: 'Đoàn Thị Lam', gender: 'FEMALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 325, class_id: 4, class_name: '7B', student_code: 'HS7B25', full_name: 'Tạ Văn Nho', gender: 'MALE', present: 94, late: 2, absent_unexcused: 3, absent_excused: 1 },
    { id: 326, class_id: 4, class_name: '7B', student_code: 'HS7B26', full_name: 'Kiều Thị Phúc', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 327, class_id: 4, class_name: '7B', student_code: 'HS7B27', full_name: 'Lại Văn Quốc', gender: 'MALE', present: 96, late: 0, absent_unexcused: 3, absent_excused: 1 },
    { id: 328, class_id: 4, class_name: '7B', student_code: 'HS7B28', full_name: 'Trịnh Thị Sương', gender: 'FEMALE', present: 99, late: 1, absent_unexcused: 0, absent_excused: 0 },
    { id: 329, class_id: 4, class_name: '7B', student_code: 'HS7B29', full_name: 'Thái Văn Toàn', gender: 'MALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
    { id: 330, class_id: 4, class_name: '7B', student_code: 'HS7B30', full_name: 'Quách Thị Út', gender: 'FEMALE', present: 98, late: 0, absent_unexcused: 1, absent_excused: 1 },
    { id: 331, class_id: 4, class_name: '7B', student_code: 'HS7B31', full_name: 'Mạc Văn Vũ', gender: 'MALE', present: 100, late: 0, absent_unexcused: 0, absent_excused: 0 },
    { id: 332, class_id: 4, class_name: '7B', student_code: 'HS7B32', full_name: 'La Thị Yến', gender: 'FEMALE', present: 96, late: 1, absent_unexcused: 2, absent_excused: 1 },
    { id: 333, class_id: 4, class_name: '7B', student_code: 'HS7B33', full_name: 'Từ Văn Bảo', gender: 'MALE', present: 93, late: 2, absent_unexcused: 3, absent_excused: 2 },
    { id: 334, class_id: 4, class_name: '7B', student_code: 'HS7B34', full_name: 'Ông Thị Cúc', gender: 'FEMALE', present: 97, late: 1, absent_unexcused: 1, absent_excused: 1 },
    { id: 335, class_id: 4, class_name: '7B', student_code: 'HS7B35', full_name: 'Nông Văn Đức', gender: 'MALE', present: 98, late: 1, absent_unexcused: 0, absent_excused: 1 },
    { id: 336, class_id: 4, class_name: '7B', student_code: 'HS7B36', full_name: 'Lưu Thị Hiền', gender: 'FEMALE', present: 95, late: 2, absent_unexcused: 2, absent_excused: 1 },
];

// ─── ATTENDANCE RECORDS (day-of-week summary per class) ─

export const attendanceDayOfWeek = {
    '6A': [
        { day: 'T2', absent: 1, late: 2 }, { day: 'T3', absent: 2, late: 1 },
        { day: 'T4', absent: 0, late: 1 }, { day: 'T5', absent: 1, late: 0 },
        { day: 'T6', absent: 1, late: 1 }, { day: 'T7', absent: 0, late: 0 },
    ],
    '6B': [
        { day: 'T2', absent: 2, late: 1 }, { day: 'T3', absent: 1, late: 2 },
        { day: 'T4', absent: 0, late: 1 }, { day: 'T5', absent: 3, late: 0 },
        { day: 'T6', absent: 1, late: 1 }, { day: 'T7', absent: 0, late: 0 },
    ],
    '7A': [
        { day: 'T2', absent: 1, late: 1 }, { day: 'T3', absent: 1, late: 0 },
        { day: 'T4', absent: 0, late: 1 }, { day: 'T5', absent: 2, late: 1 },
        { day: 'T6', absent: 0, late: 0 }, { day: 'T7', absent: 1, late: 0 },
    ],
    '7B': [
        { day: 'T2', absent: 1, late: 1 }, { day: 'T3', absent: 2, late: 0 },
        { day: 'T4', absent: 1, late: 1 }, { day: 'T5', absent: 1, late: 1 },
        { day: 'T6', absent: 0, late: 1 }, { day: 'T7', absent: 0, late: 0 },
    ],
};

// ─── ATTENDANCE TREND (monthly % chuyên cần) ────────────

export const attendanceTrend = {
    school: [
        { month: 'T9', rate: 96.2 }, { month: 'T10', rate: 95.8 }, { month: 'T11', rate: 94.1 },
        { month: 'T12', rate: 95.5 }, { month: 'T1', rate: 93.0 }, { month: 'T2', rate: 94.3 },
    ],
    grade6: [
        { month: 'T9', rate: 95.5 }, { month: 'T10', rate: 94.8 }, { month: 'T11', rate: 93.2 },
        { month: 'T12', rate: 94.7 }, { month: 'T1', rate: 92.1 }, { month: 'T2', rate: 93.5 },
    ],
    grade7: [
        { month: 'T9', rate: 96.8 }, { month: 'T10', rate: 96.2 }, { month: 'T11', rate: 95.0 },
        { month: 'T12', rate: 96.0 }, { month: 'T1', rate: 93.8 }, { month: 'T2', rate: 95.1 },
    ],
    '6A': [
        { month: 'T9', rate: 96.0 }, { month: 'T10', rate: 95.5 }, { month: 'T11', rate: 93.8 },
        { month: 'T12', rate: 95.2 }, { month: 'T1', rate: 92.5 }, { month: 'T2', rate: 94.0 },
    ],
    '6B': [
        { month: 'T9', rate: 95.0 }, { month: 'T10', rate: 94.0 }, { month: 'T11', rate: 92.5 },
        { month: 'T12', rate: 94.2 }, { month: 'T1', rate: 91.8 }, { month: 'T2', rate: 93.0 },
    ],
    '7A': [
        { month: 'T9', rate: 97.0 }, { month: 'T10', rate: 96.5 }, { month: 'T11', rate: 95.2 },
        { month: 'T12', rate: 96.3 }, { month: 'T1', rate: 94.0 }, { month: 'T2', rate: 95.5 },
    ],
    '7B': [
        { month: 'T9', rate: 96.5 }, { month: 'T10', rate: 96.0 }, { month: 'T11', rate: 94.8 },
        { month: 'T12', rate: 95.8 }, { month: 'T1', rate: 93.5 }, { month: 'T2', rate: 94.8 },
    ],
};

// ─── CLASS COMPARISON (current month vs prev) ───────────

export const classComparison = [
    { class_name: '6A', rate: 95.6, prev_rate: 94.8 },
    { class_name: '6B', rate: 93.5, prev_rate: 92.8 },
    { class_name: '7A', rate: 96.1, prev_rate: 95.5 },
    { class_name: '7B', rate: 94.8, prev_rate: 94.2 },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────

const SEMESTER_SESSIONS = 100;
const periodSessions = { today: 1, week: 5, month: 20, semester: SEMESTER_SESSIONS };

/**
 * Lấy danh sách Select options cho lớp
 */
export const classSelectOptions = classes.map(c => ({ value: c.class_name, label: c.class_name }));

/**
 * Lấy danh sách học sinh theo lớp
 */
export const getStudentsByClass = (className) =>
    students.filter(s => s.class_name === className);

/**
 * Lấy Select options danh sách HS theo lớp
 */
export const getStudentSelectOptions = (className) =>
    getStudentsByClass(className).map(s => ({
        value: String(s.id), label: `${s.full_name} (${s.student_code})`
    }));

/**
 * Tìm 1 học sinh theo id
 */
export const getStudentById = (id) =>
    students.find(s => String(s.id) === String(id));

/**
 * Thống kê tổng quan lớp, scale theo period
 */
export const getClassStats = (className, period = 'semester') => {
    const list = getStudentsByClass(className);
    const scale = (periodSessions[period] || SEMESTER_SESSIONS) / SEMESTER_SESSIONS;
    const raw = {
        present: list.reduce((s, st) => s + st.present, 0),
        late: list.reduce((s, st) => s + st.late, 0),
        absent: list.reduce((s, st) => s + st.absent_unexcused, 0),
        excused: list.reduce((s, st) => s + st.absent_excused, 0),
    };
    return {
        total: list.length,
        sessions: periodSessions[period] || SEMESTER_SESSIONS,
        present: Math.round(raw.present * scale),
        late: Math.round(raw.late * scale),
        absent: Math.round(raw.absent * scale),
        excused: Math.round(raw.excused * scale),
    };
};

/**
 * Tỷ lệ chuyên cần (%) của 1 HS (tính trên cả học kỳ)
 */
export const getStudentRate = (student) =>
    ((student.present + student.late) / SEMESTER_SESSIONS * 100).toFixed(1);

/**
 * Kiểm tra HS nguy cơ: vắng KP ≥ 5 hoặc chuyên cần < 80%
 */
export const isStudentAtRisk = (student) =>
    student.absent_unexcused >= 5 || parseFloat(getStudentRate(student)) < 80;

/**
 * Danh sách HS nguy cơ trong lớp
 */
export const getRiskStudents = (className) =>
    getStudentsByClass(className).filter(isStudentAtRisk);

/**
 * Top N HS vắng nhiều nhất
 */
export const getTopAbsentStudents = (className, n = 5) =>
    [...getStudentsByClass(className)]
        .sort((a, b) => b.absent_unexcused - a.absent_unexcused)
        .slice(0, n);

/**
 * Vắng theo tháng cho 1 HS (distribute across months 9 → 2)
 */
export const getStudentMonthlyAbsent = (studentId) => {
    const student = getStudentById(studentId);
    if (!student) return Array(12).fill(0);
    const total = student.absent_unexcused;
    const arr = Array(12).fill(0);
    for (let i = 0; i < total; i++) arr[8 + (i % 6)] += 1;
    return arr;
};

/**
 * Xu hướng chuyên cần theo tháng (mock line chart data)
 */
export const getStudentTrendLine = (studentId) => {
    const monthly = getStudentMonthlyAbsent(studentId);
    const months = ['T9', 'T10', 'T11', 'T12', 'T1', 'T2'];
    return months.map((m, i) => ({
        label: m,
        value: parseFloat((100 - (monthly[8 + i] || 0) * 5).toFixed(1)),
    }));
};

/**
 * Period options cho Select/Pills
 */
export const periodOptions = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'semester', label: 'Học kỳ' },
];

/**
 * Scope options cho tab Theo thời gian
 */
export const scopeOptions = [
    { value: 'school', label: 'Toàn trường' },
    { value: 'grade6', label: 'Khối 6' },
    { value: 'grade7', label: 'Khối 7' },
    { value: '6A', label: 'Lớp 6A' },
    { value: '6B', label: 'Lớp 6B' },
    { value: '7A', label: 'Lớp 7A' },
    { value: '7B', label: 'Lớp 7B' },
];

// ─── ATTENDANCE LOGS (chi tiết từng lần vắng/muộn) ──────

const excusedReasons = [
    'Bệnh (có giấy bác sĩ)', 'Việc gia đình', 'Khám sức khỏe định kỳ',
    'Thi học sinh giỏi cấp huyện', 'Đau bụng, phụ huynh xin phép',
    'Sốt, nghỉ theo chỉ định bác sĩ',
];
const unexcusedReasons = [
    'Không rõ lý do', 'Không liên lạc được PH', 'Ngủ quên',
    'Trốn học', 'PH không thông báo', '',
];
const lateReasons = [
    'Kẹt xe', 'Dậy trễ', 'Xe hỏng giữa đường',
    'Mưa lớn', 'Đưa em đi học trước', 'Chờ xe buýt',
];
const sessions = ['Sáng', 'Chiều'];

// Seeded pseudo-random for consistent results per student
const seededRand = (seed) => {
    let s = seed;
    return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
};

/**
 * Lịch sử log vắng/muộn của 1 HS trong học kỳ
 * Returns: [{ id, date, session, type, reason }]
 * type: 'absent_unexcused' | 'absent_excused' | 'late'
 */
export const getStudentAttendanceLogs = (studentId) => {
    const student = getStudentById(studentId);
    if (!student) return [];

    const rand = seededRand(student.id * 137 + 42);
    const logs = [];
    let logId = 1;

    // Helper to pick a random date in HK2 (Sep 2025 → Feb 2026)
    const monthDays = [
        { y: 2025, m: 9, days: 22 }, { y: 2025, m: 10, days: 23 },
        { y: 2025, m: 11, days: 21 }, { y: 2025, m: 12, days: 20 },
        { y: 2026, m: 1, days: 18 }, { y: 2026, m: 2, days: 16 },
    ];

    const pickDate = (idx, total) => {
        const mIdx = Math.floor((idx / Math.max(total, 1)) * monthDays.length) % monthDays.length;
        const md = monthDays[mIdx];
        const day = Math.min(1 + Math.floor(rand() * md.days), md.days);
        return `${String(day).padStart(2, '0')}/${String(md.m).padStart(2, '0')}/${md.y}`;
    };

    // Generate unexcused absence logs
    for (let i = 0; i < student.absent_unexcused; i++) {
        logs.push({
            id: logId++,
            date: pickDate(i, student.absent_unexcused),
            session: sessions[Math.floor(rand() * 2)],
            type: 'absent_unexcused',
            reason: unexcusedReasons[Math.floor(rand() * unexcusedReasons.length)],
        });
    }

    // Generate excused absence logs
    for (let i = 0; i < student.absent_excused; i++) {
        logs.push({
            id: logId++,
            date: pickDate(i, student.absent_excused),
            session: sessions[Math.floor(rand() * 2)],
            type: 'absent_excused',
            reason: excusedReasons[Math.floor(rand() * excusedReasons.length)],
        });
    }

    // Generate late logs
    for (let i = 0; i < student.late; i++) {
        const mins = 3 + Math.floor(rand() * 20);
        logs.push({
            id: logId++,
            date: pickDate(i, student.late),
            session: sessions[Math.floor(rand() * 2)],
            type: 'late',
            reason: `${lateReasons[Math.floor(rand() * lateReasons.length)]} (${mins} phút)`,
        });
    }

    // Sort by date descending (most recent first)
    logs.sort((a, b) => {
        const [dA, mA, yA] = a.date.split('/').map(Number);
        const [dB, mB, yB] = b.date.split('/').map(Number);
        return (yB * 10000 + mB * 100 + dB) - (yA * 10000 + mA * 100 + dA);
    });

    return logs;
};
