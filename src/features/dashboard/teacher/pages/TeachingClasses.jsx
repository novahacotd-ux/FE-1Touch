import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeachingClasses.css';

// Mock data - Danh sách lớp giảng dạy (based on ERD: classes + teacher_assignments)
const teachingClassesData = [
    {
        id: 1,
        className: '6A',
        grade: 'Khối 6',
        gradeLevel: 6,
        totalStudents: 35,
        maleStudents: 18,
        femaleStudents: 17,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.201',
        homeroomTeacher: 'Nguyễn Thị Lan',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    {
        id: 2,
        className: '6B',
        grade: 'Khối 6',
        gradeLevel: 6,
        totalStudents: 32,
        maleStudents: 15,
        femaleStudents: 17,
        role: 'HOMEROOM',
        subject: 'Chủ nhiệm',
        room: 'P.202',
        homeroomTeacher: null, // Bạn là chủ nhiệm
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    {
        id: 3,
        className: '7A',
        grade: 'Khối 7',
        gradeLevel: 7,
        totalStudents: 38,
        maleStudents: 20,
        femaleStudents: 18,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.301',
        homeroomTeacher: 'Trần Văn Minh',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    {
        id: 4,
        className: '7B',
        grade: 'Khối 7',
        gradeLevel: 7,
        totalStudents: 36,
        maleStudents: 17,
        femaleStudents: 19,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.302',
        homeroomTeacher: 'Lê Thị Hương',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    {
        id: 5,
        className: '8A',
        grade: 'Khối 8',
        gradeLevel: 8,
        totalStudents: 40,
        maleStudents: 22,
        femaleStudents: 18,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.401',
        homeroomTeacher: 'Phạm Văn Đức',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    {
        id: 6,
        className: '8B',
        grade: 'Khối 8',
        gradeLevel: 8,
        totalStudents: 38,
        maleStudents: 19,
        femaleStudents: 19,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.402',
        homeroomTeacher: 'Hoàng Thị Mai',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
];

// Danh sách khối để filter
const gradeOptions = [
    { value: 'all', label: 'Tất cả khối' },
    { value: 6, label: 'Khối 6' },
    { value: 7, label: 'Khối 7' },
    { value: 8, label: 'Khối 8' },
    { value: 9, label: 'Khối 9' },
];

// Danh sách vai trò để filter
const roleOptions = [
    { value: 'all', label: 'Tất cả vai trò' },
    { value: 'HOMEROOM', label: 'Chủ nhiệm' },
    { value: 'SUBJECT', label: 'Bộ môn' },
];

function TeachingClasses() {
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter classes based on selected filters
    const filteredClasses = teachingClassesData.filter(cls => {
        const gradeMatch = selectedGrade === 'all' || cls.gradeLevel === Number(selectedGrade);
        const roleMatch = selectedRole === 'all' || cls.role === selectedRole;
        const searchMatch = searchQuery === '' ||
            cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return gradeMatch && roleMatch && searchMatch;
    });

    // Statistics
    const totalClasses = teachingClassesData.length;
    const homeroomCount = teachingClassesData.filter(c => c.role === 'HOMEROOM').length;
    const subjectCount = teachingClassesData.filter(c => c.role === 'SUBJECT').length;
    const totalStudents = teachingClassesData.reduce((sum, c) => sum + c.totalStudents, 0);

    // Handle class click
    const handleClassClick = (classId) => {
        navigate(`/teacher/teaching-classes/${classId}`);
    };

    return (
        <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
            {/* Header */}
            <div className="teaching-classes-header card-db">
                <div className="header-left">
                    <h2 className="page-title">
                        <i className="fas fa-chalkboard-teacher"></i>
                        Lớp giảng dạy
                    </h2>
                    <span className="page-subtitle">
                        Năm học 2025-2026 • Học kỳ 2
                    </span>
                </div>

                <div className="header-controls">
                    {/* Search */}
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Grade Filter */}
                    <div className="filter-group">
                        <select
                            className="form-select"
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            {gradeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div className="filter-group">
                        <select
                            className="form-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <i className="fas fa-school"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalClasses}</span>
                        <span className="stat-label">Tổng số lớp</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon homeroom">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{homeroomCount}</span>
                        <span className="stat-label">Lớp chủ nhiệm</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon subject">
                        <i className="fas fa-book"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{subjectCount}</span>
                        <span className="stat-label">Lớp bộ môn</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon students">
                        <i className="fas fa-user-graduate"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalStudents}</span>
                        <span className="stat-label">Tổng học sinh</span>
                    </div>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="classes-section card-db">
                <div className="card-db-header">
                    <i className="fas fa-list"></i>
                    <span>Danh sách lớp ({filteredClasses.length})</span>
                </div>
                <div className="card-db-body">
                    {filteredClasses.length > 0 ? (
                        <div className="classes-grid">
                            {filteredClasses.map(cls => (
                                <div
                                    key={cls.id}
                                    className={`class-card ${cls.role.toLowerCase()}`}
                                    onClick={() => handleClassClick(cls.id)}
                                >
                                    <div className="class-card-header">
                                        <div className="class-name-wrap">
                                            <span className="class-name">{cls.className}</span>
                                            <span className="class-grade">{cls.grade}</span>
                                        </div>
                                        <span className={`role-badge ${cls.role.toLowerCase()}`}>
                                            {cls.role === 'HOMEROOM' ? (
                                                <>
                                                    <i className="fas fa-star"></i> CN
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-book"></i> BM
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="class-card-body">
                                        <div className="class-subject">
                                            <i className="fas fa-graduation-cap"></i>
                                            <span>{cls.subject}</span>
                                        </div>
                                        <div className="class-room">
                                            <i className="fas fa-door-open"></i>
                                            <span>{cls.room}</span>
                                        </div>
                                        {cls.role === 'SUBJECT' && cls.homeroomTeacher && (
                                            <div className="class-homeroom">
                                                <i className="fas fa-user-tie"></i>
                                                <span>CN: {cls.homeroomTeacher}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="class-card-footer">
                                        <div className="student-stats">
                                            <div className="student-total">
                                                <i className="fas fa-users"></i>
                                                <span>{cls.totalStudents} học sinh</span>
                                            </div>
                                            <div className="student-gender">
                                                <span className="male">
                                                    <i className="fas fa-male"></i> {cls.maleStudents}
                                                </span>
                                                <span className="female">
                                                    <i className="fas fa-female"></i> {cls.femaleStudents}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="view-detail">
                                            <span>Xem chi tiết</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>Không tìm thấy lớp phù hợp với bộ lọc</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeachingClasses;
