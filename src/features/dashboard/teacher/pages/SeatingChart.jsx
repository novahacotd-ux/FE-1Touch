// SeatingChart.jsx - Sơ đồ chỗ ngồi
import { useState, useCallback } from 'react';
import {
    FiGrid,
    FiUsers,
    FiSave,
    FiRefreshCw,
    FiEye,
    FiSearch,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiFileText,
    FiMapPin,
    FiClock,
    FiX,
    FiMove,
    FiUserMinus,
    FiHome,
    FiBook,
} from 'react-icons/fi';
import './SeatingChart.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Select from '../../admin/components/ui/Select';

// Mock data - Seat map configuration
const seatMapConfig = {
    id: 1,
    classId: 1,
    className: '6A',
    rows: 8,
    columns: 8,
};

// Mock data - Students with seats and attendance status
const initialStudentsData = [
    { id: 1, fullName: 'Nguyễn Văn An', studentCode: 'HS001', seatRow: 1, seatCol: 1, status: 'PRESENT', checkTime: '07:28' },
    { id: 2, fullName: 'Trần Thị Bình', studentCode: 'HS002', seatRow: 1, seatCol: 2, status: 'PRESENT', checkTime: '07:29' },
    { id: 3, fullName: 'Lê Văn Cường', studentCode: 'HS003', seatRow: 1, seatCol: 3, status: 'LATE', checkTime: '07:38' },
    { id: 4, fullName: 'Phạm Thị Dung', studentCode: 'HS004', seatRow: 1, seatCol: 4, status: 'ABSENT', checkTime: null },
    { id: 5, fullName: 'Hoàng Văn Em', studentCode: 'HS005', seatRow: 1, seatCol: 5, status: 'PRESENT', checkTime: '07:27' },
    { id: 6, fullName: 'Ngô Thị Phương', studentCode: 'HS006', seatRow: 2, seatCol: 1, status: 'PRESENT', checkTime: '07:30' },
    { id: 7, fullName: 'Đỗ Văn Giang', studentCode: 'HS007', seatRow: 2, seatCol: 2, status: 'PRESENT', checkTime: '07:25' },
    { id: 8, fullName: 'Vũ Thị Hương', studentCode: 'HS008', seatRow: 2, seatCol: 3, status: 'EXCUSED', checkTime: null },
    { id: 9, fullName: 'Bùi Văn Khoa', studentCode: 'HS009', seatRow: 2, seatCol: 4, status: 'PRESENT', checkTime: '07:29' },
    { id: 10, fullName: 'Đinh Thị Lan', studentCode: 'HS010', seatRow: 2, seatCol: 5, status: 'PRESENT', checkTime: '07:28' },
    { id: 11, fullName: 'Trương Văn Long', studentCode: 'HS011', seatRow: 3, seatCol: 1, status: 'PRESENT', checkTime: '07:26' },
    { id: 12, fullName: 'Lý Thị Mai', studentCode: 'HS012', seatRow: 3, seatCol: 2, status: 'PRESENT', checkTime: '07:30' },
    { id: 13, fullName: 'Hồ Văn Nam', studentCode: 'HS013', seatRow: 3, seatCol: 4, status: 'PRESENT', checkTime: '07:27' },
    { id: 14, fullName: 'Phan Thị Oanh', studentCode: 'HS014', seatRow: 3, seatCol: 5, status: 'PRESENT', checkTime: '07:29' },
    { id: 15, fullName: 'Cao Văn Phú', studentCode: 'HS015', seatRow: 4, seatCol: 1, status: 'LATE', checkTime: '07:40' },
    { id: 16, fullName: 'Dương Thị Quỳnh', studentCode: 'HS016', seatRow: 4, seatCol: 2, status: 'PRESENT', checkTime: '07:28' },
    { id: 17, fullName: 'Lương Văn Sơn', studentCode: 'HS017', seatRow: 4, seatCol: 3, status: 'PRESENT', checkTime: '07:26' },
    { id: 18, fullName: 'Mai Thị Thu', studentCode: 'HS018', seatRow: 4, seatCol: 4, status: 'ABSENT', checkTime: null },
    { id: 19, fullName: 'Nghiêm Văn Uy', studentCode: 'HS019', seatRow: 4, seatCol: 5, status: 'PRESENT', checkTime: '07:30' },
    { id: 20, fullName: 'Tạ Thị Vân', studentCode: 'HS020', seatRow: 5, seatCol: 1, status: 'PRESENT', checkTime: '07:29' },
    { id: 21, fullName: 'Đặng Văn Xuân', studentCode: 'HS021', seatRow: 5, seatCol: 2, status: 'PRESENT', checkTime: '07:27' },
    { id: 22, fullName: 'Lại Thị Yến', studentCode: 'HS022', seatRow: 5, seatCol: 3, status: 'PRESENT', checkTime: '07:28' },
    // Unassigned students
    { id: 23, fullName: 'Trịnh Văn Hoàng', studentCode: 'HS023', seatRow: null, seatCol: null, status: 'UNKNOWN', checkTime: null },
    { id: 24, fullName: 'Võ Thị Kim', studentCode: 'HS024', seatRow: null, seatCol: null, status: 'UNKNOWN', checkTime: null },
    { id: 25, fullName: 'Lâm Văn Tùng', studentCode: 'HS025', seatRow: null, seatCol: null, status: 'UNKNOWN', checkTime: null },
];

const classOptions = [
    { value: '1', label: 'Lớp 6A' },
    { value: '2', label: 'Lớp 6B' },
    { value: '3', label: 'Lớp 7A' },
    { value: '4', label: 'Lớp 7B' },
];

const statusConfig = {
    PRESENT: { label: 'Có mặt', className: 'present', color: 'var(--good)' },
    ABSENT: { label: 'Vắng', className: 'absent', color: 'var(--bad)' },
    LATE: { label: 'Muộn', className: 'late', color: 'var(--warn)' },
    EXCUSED: { label: 'Có phép', className: 'excused', color: 'var(--info)' },
    UNKNOWN: { label: 'Chưa điểm danh', className: 'unknown', color: 'var(--ts)' },
};

function SeatingChart() {
    const [selectedClass, setSelectedClass] = useState('1');
    const [students, setStudents] = useState(initialStudentsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNames, setShowNames] = useState(true);
    const [draggedStudent, setDraggedStudent] = useState(null);
    const [dragOverSeat, setDragOverSeat] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);

    // Get student at specific seat
    const getStudentAtSeat = useCallback((row, col) => {
        return students.find(s => s.seatRow === row && s.seatCol === col);
    }, [students]);

    // Get unassigned students
    const unassignedStudents = students.filter(s => s.seatRow === null || s.seatCol === null);
    const filteredUnassigned = unassignedStudents.filter(s =>
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Statistics
    const assignedStudents = students.filter(s => s.seatRow !== null && s.seatCol !== null);
    const presentCount = assignedStudents.filter(s => s.status === 'PRESENT').length;
    const absentCount = assignedStudents.filter(s => s.status === 'ABSENT').length;
    const lateCount = assignedStudents.filter(s => s.status === 'LATE').length;
    const excusedCount = assignedStudents.filter(s => s.status === 'EXCUSED').length;

    // Get initials
    const getInitials = (name) => {
        const parts = name.split(' ');
        return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
    };

    // Drag handlers
    const handleDragStart = (e, student) => {
        setDraggedStudent(student);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', student.id);
    };

    const handleDragEnd = () => {
        setDraggedStudent(null);
        setDragOverSeat(null);
    };

    const handleDragOver = (e, row, col) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverSeat({ row, col });
    };

    const handleDragLeave = () => {
        setDragOverSeat(null);
    };

    const handleDrop = (e, targetRow, targetCol) => {
        e.preventDefault();
        setDragOverSeat(null);

        if (!draggedStudent) return;

        // Check if target seat is occupied
        const occupyingStudent = getStudentAtSeat(targetRow, targetCol);

        setStudents(prev => prev.map(s => {
            if (s.id === draggedStudent.id) {
                // Move dragged student to new seat
                return { ...s, seatRow: targetRow, seatCol: targetCol };
            }
            if (occupyingStudent && s.id === occupyingStudent.id) {
                // Swap: move occupying student to dragged student's old seat
                return { ...s, seatRow: draggedStudent.seatRow, seatCol: draggedStudent.seatCol };
            }
            return s;
        }));

        setDraggedStudent(null);
    };

    const handleDropToUnassigned = (e) => {
        e.preventDefault();
        if (!draggedStudent) return;

        setStudents(prev => prev.map(s => {
            if (s.id === draggedStudent.id) {
                return { ...s, seatRow: null, seatCol: null };
            }
            return s;
        }));

        setDraggedStudent(null);
    };

    // Click handlers
    const handleSeatClick = (student) => {
        if (student) {
            setSelectedStudent(student);
            setShowInfoModal(true);
        }
    };

    const handleCloseInfoModal = () => {
        setShowInfoModal(false);
        setSelectedStudent(null);
    };

    const handleRemoveFromSeat = () => {
        if (!selectedStudent) return;

        setStudents(prev => prev.map(s => {
            if (s.id === selectedStudent.id) {
                return { ...s, seatRow: null, seatCol: null };
            }
            return s;
        }));

        handleCloseInfoModal();
    };

    const handleReset = () => {
        setStudents(initialStudentsData);
    };

    const handleSave = () => {
        // TODO: Save to backend
        alert('Đã lưu sơ đồ chỗ ngồi!');
    };

    // Generate seat grid
    const renderSeatGrid = () => {
        const rows = [];
        for (let r = 1; r <= seatMapConfig.rows; r++) {
            const cols = [];
            for (let c = 1; c <= seatMapConfig.columns; c++) {
                const student = getStudentAtSeat(r, c);
                const isDragOver = dragOverSeat?.row === r && dragOverSeat?.col === c;
                const isDragging = draggedStudent?.seatRow === r && draggedStudent?.seatCol === c;
                const statusClass = student ? statusConfig[student.status]?.className || 'unknown' : 'empty';

                cols.push(
                    <div
                        key={`${r}-${c}`}
                        className={`seat seat--${statusClass} ${isDragOver ? 'seat--drag-over' : ''} ${isDragging ? 'seat--dragging' : ''}`}
                        draggable={!!student}
                        onDragStart={(e) => student && handleDragStart(e, student)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, r, c)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, r, c)}
                        onClick={() => handleSeatClick(student)}
                    >
                        <span className="seat-label">{r}-{c}</span>
                        {student ? (
                            <>
                                <div className="seat-avatar">
                                    {getInitials(student.fullName)}
                                </div>
                                {showNames && (
                                    <span className="seat-name">{student.fullName.split(' ').pop()}</span>
                                )}
                            </>
                        ) : (
                            <span className="seat-empty-icon">+</span>
                        )}
                    </div>
                );
            }
            rows.push(
                <div key={r} style={{ display: 'contents' }}>
                    {cols}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiGrid />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Sơ đồ chỗ ngồi</div>
                        <div className="sub">Năm học 2025-2026 • Học kỳ 2</div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="seating-toolbar">
                        <div className="filter" style={{ minWidth: '180px' }}>
                            <Select
                                value={selectedClass}
                                onChange={setSelectedClass}
                                options={classOptions}
                            />
                        </div>

                        <div className="toolbar-divider" />

                        <button className="btn btn--primary" onClick={handleSave}>
                            <FiSave />
                            Lưu sơ đồ
                        </button>

                        <button className="btn" onClick={handleReset}>
                            <FiRefreshCw />
                            Reset
                        </button>

                        <button
                            className={`btn ${showNames ? 'btn--primary' : ''}`}
                            onClick={() => setShowNames(!showNames)}
                        >
                            <FiEye />
                            {showNames ? 'Ẩn tên' : 'Hiện tên'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="seating-stats">
                <div className="seating-stat">
                    <div className="seating-stat-icon seating-stat-icon--total">
                        <FiUsers />
                    </div>
                    <div>
                        <div className="seating-stat-value">{assignedStudents.length}/{students.length}</div>
                        <div className="seating-stat-label">Đã xếp chỗ</div>
                    </div>
                </div>
                <div className="seating-stat">
                    <div className="seating-stat-icon seating-stat-icon--present">
                        <FiCheckCircle />
                    </div>
                    <div>
                        <div className="seating-stat-value">{presentCount}</div>
                        <div className="seating-stat-label">Có mặt</div>
                    </div>
                </div>
                <div className="seating-stat">
                    <div className="seating-stat-icon seating-stat-icon--absent">
                        <FiXCircle />
                    </div>
                    <div>
                        <div className="seating-stat-value">{absentCount}</div>
                        <div className="seating-stat-label">Vắng</div>
                    </div>
                </div>
                <div className="seating-stat">
                    <div className="seating-stat-icon seating-stat-icon--late">
                        <FiAlertCircle />
                    </div>
                    <div>
                        <div className="seating-stat-value">{lateCount}</div>
                        <div className="seating-stat-label">Muộn</div>
                    </div>
                </div>
                <div className="seating-stat">
                    <div className="seating-stat-icon seating-stat-icon--excused">
                        <FiFileText />
                    </div>
                    <div>
                        <div className="seating-stat-value">{excusedCount}</div>
                        <div className="seating-stat-label">Có phép</div>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="seating-layout">
                {/* Seat Grid Area */}
                <Card
                    title={`Sơ đồ lớp ${seatMapConfig.className}`}
                    icon={<FiGrid />}
                    subtitle={`${seatMapConfig.rows} hàng × ${seatMapConfig.columns} cột`}
                    right={<Pill tone="info">{assignedStudents.length} học sinh</Pill>}
                >
                    {/* Teacher Area */}
                    <div className="teacher-area">
                        <FiBook />
                        BẢNG (GIÁO VIÊN)
                    </div>

                    {/* Seat Grid */}
                    <div className="seat-grid-container">
                        <div
                            className="seat-grid"
                            style={{
                                gridTemplateColumns: `repeat(${seatMapConfig.columns}, 80px)`,
                            }}
                        >
                            {renderSeatGrid()}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="seating-legend">
                        <div className="legend-item">
                            <span className="legend-dot legend-dot--present"></span>
                            Có mặt
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot legend-dot--absent"></span>
                            Vắng
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot legend-dot--late"></span>
                            Muộn
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot legend-dot--excused"></span>
                            Có phép
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot legend-dot--empty"></span>
                            Trống
                        </div>
                    </div>
                </Card>

                {/* Unassigned Students Panel */}
                <div className="student-panel">
                    <Card
                        title={`Chưa xếp chỗ (${unassignedStudents.length})`}
                        icon={<FiUsers />}
                        subtitle="Kéo thả vào ghế trống"
                    >
                        <div className="filter" style={{ marginBottom: '12px' }}>
                            <input
                                className="textInput"
                                type="text"
                                placeholder="Tìm học sinh..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div
                            className="student-list"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropToUnassigned}
                        >
                            {filteredUnassigned.length > 0 ? (
                                filteredUnassigned.map(student => (
                                    <div
                                        key={student.id}
                                        className={`student-card ${draggedStudent?.id === student.id ? 'student-card--dragging' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, student)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="student-card-avatar">
                                            {getInitials(student.fullName)}
                                        </div>
                                        <div className="student-card-info">
                                            <span className="student-card-name">{student.fullName}</span>
                                            <span className="student-card-code">{student.studentCode}</span>
                                        </div>
                                        <FiMove className="student-card-drag-icon" />
                                    </div>
                                ))
                            ) : (
                                <div className="unassigned-empty">
                                    {unassignedStudents.length === 0 ? (
                                        <>
                                            <FiCheckCircle />
                                            <p>Tất cả học sinh đã được xếp chỗ!</p>
                                        </>
                                    ) : (
                                        <>
                                            <FiSearch />
                                            <p>Không tìm thấy học sinh</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Student Info Modal */}
            {showInfoModal && selectedStudent && (
                <div className="modalBackdrop" onClick={handleCloseInfoModal}>
                    <div className="modal" style={{ width: 'min(420px, 95%)' }} onClick={e => e.stopPropagation()}>
                        <div className="modalHead">
                            <div className="modalTitle">Thông tin học sinh</div>
                            <button className="modalClose" onClick={handleCloseInfoModal}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modalBody">
                            <div className="student-info-modal">
                                <div className="student-info-header">
                                    <div
                                        className="student-info-avatar"
                                        style={{
                                            background: statusConfig[selectedStudent.status]?.color || 'var(--mc-trans)',
                                            color: '#fff',
                                        }}
                                    >
                                        {getInitials(selectedStudent.fullName)}
                                    </div>
                                    <div className="student-info-details">
                                        <div className="student-info-name">{selectedStudent.fullName}</div>
                                        <div className="student-info-code">Mã HS: {selectedStudent.studentCode}</div>
                                        <div className="student-info-class">Lớp: {seatMapConfig.className}</div>
                                    </div>
                                </div>

                                <div className="student-info-row">
                                    <FiMapPin />
                                    <span>Vị trí</span>
                                    <strong>Hàng {selectedStudent.seatRow}, Cột {selectedStudent.seatCol}</strong>
                                </div>

                                <div className="student-info-row">
                                    <FiCheckCircle style={{ color: statusConfig[selectedStudent.status]?.color }} />
                                    <span>Điểm danh hôm nay</span>
                                    <strong style={{ color: statusConfig[selectedStudent.status]?.color }}>
                                        {statusConfig[selectedStudent.status]?.label}
                                    </strong>
                                </div>

                                {selectedStudent.checkTime && (
                                    <div className="student-info-row">
                                        <FiClock />
                                        <span>Check-in</span>
                                        <strong>{selectedStudent.checkTime}</strong>
                                    </div>
                                )}

                                <div className="student-info-actions">
                                    <button className="btn" onClick={handleCloseInfoModal}>
                                        <FiX />
                                        Đóng
                                    </button>
                                    <button className="btn" onClick={handleRemoveFromSeat}>
                                        <FiUserMinus />
                                        Bỏ chỗ ngồi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeatingChart;
