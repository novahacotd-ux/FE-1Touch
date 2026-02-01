// TeachingClasses.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiBook,
    FiUsers,
    FiStar,
    FiSearch,
    FiHome,
    FiArrowRight,
    FiUser,
} from 'react-icons/fi';
import './TeachingClasses.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Select from '../../admin/components/ui/Select';

// Mock data - Danh sách lớp giảng dạy
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
        homeroomTeacher: null,
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

const gradeOptions = [
    { value: 'all', label: 'Tất cả khối' },
    { value: '6', label: 'Khối 6' },
    { value: '7', label: 'Khối 7' },
    { value: '8', label: 'Khối 8' },
    { value: '9', label: 'Khối 9' },
];

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

    const filteredClasses = teachingClassesData.filter(cls => {
        const gradeMatch = selectedGrade === 'all' || cls.gradeLevel === Number(selectedGrade);
        const roleMatch = selectedRole === 'all' || cls.role === selectedRole;
        const searchMatch = searchQuery === '' ||
            cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return gradeMatch && roleMatch && searchMatch;
    });

    const totalClasses = teachingClassesData.length;
    const homeroomCount = teachingClassesData.filter(c => c.role === 'HOMEROOM').length;
    const subjectCount = teachingClassesData.filter(c => c.role === 'SUBJECT').length;
    const totalStudents = teachingClassesData.reduce((sum, c) => sum + c.totalStudents, 0);

    const handleClassClick = (classId) => {
        navigate(`/teacher/teaching-classes/${classId}`);
    };

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiBook />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Lớp giảng dạy</div>
                        <div className="sub">Năm học 2025-2026 • Học kỳ 2</div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="filterRow" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
                        <div className="filter">
                            <div className="filterLabel">
                                <FiSearch />
                            </div>
                            <input
                                className="textInput"
                                type="text"
                                placeholder="Tìm kiếm lớp..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="filter">
                            <div className="filterLabel">
                                <FiHome />
                            </div>
                            <Select
                                value={selectedGrade}
                                onChange={setSelectedGrade}
                                options={gradeOptions}
                            />
                        </div>

                        <div className="filter">
                            <div className="filterLabel">
                                <FiStar />
                            </div>
                            <Select
                                value={selectedRole}
                                onChange={setSelectedRole}
                                options={roleOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--mc)' }}><FiHome /></div>
                    <div>
                        <div className="factValue">{totalClasses}</div>
                        <div className="factLabel">Tổng số lớp</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--warn)' }}><FiStar /></div>
                    <div>
                        <div className="factValue">{homeroomCount}</div>
                        <div className="factLabel">Lớp chủ nhiệm</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--info)' }}><FiBook /></div>
                    <div>
                        <div className="factValue">{subjectCount}</div>
                        <div className="factLabel">Lớp bộ môn</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--good)' }}><FiUsers /></div>
                    <div>
                        <div className="factValue">{totalStudents}</div>
                        <div className="factLabel">Tổng học sinh</div>
                    </div>
                </div>
            </div>

            {/* Classes Grid */}
            <Card
                title={`Danh sách lớp (${filteredClasses.length})`}
                icon={<FiUsers />}
                subtitle="Nhấn vào lớp để xem chi tiết"
                right={<Pill tone="info">{filteredClasses.length} lớp</Pill>}
            >
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
                                    <span className={`pill pill--${cls.role === 'HOMEROOM' ? 'warn' : 'info'}`}>
                                        {cls.role === 'HOMEROOM' ? (
                                            <><FiStar size={12} /> CN</>
                                        ) : (
                                            <><FiBook size={12} /> BM</>
                                        )}
                                    </span>
                                </div>

                                <div className="class-card-body">
                                    <div className="class-info-row">
                                        <FiBook size={14} />
                                        <span>{cls.subject}</span>
                                    </div>
                                    <div className="class-info-row">
                                        <FiHome size={14} />
                                        <span>{cls.room}</span>
                                    </div>
                                    {cls.role === 'SUBJECT' && cls.homeroomTeacher && (
                                        <div className="class-info-row muted">
                                            <FiUser size={14} />
                                            <span>CN: {cls.homeroomTeacher}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="class-card-footer">
                                    <div className="student-stats">
                                        <span className="tag tag--muted">
                                            <FiUsers size={12} /> {cls.totalStudents} học sinh
                                        </span>
                                    </div>
                                    <div className="view-detail">
                                        <span>Chi tiết</span>
                                        <FiArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="emptyBox">
                        <FiSearch size={24} />
                        <p>Không tìm thấy lớp phù hợp với bộ lọc</p>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default TeachingClasses;
