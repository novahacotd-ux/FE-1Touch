import { useState } from 'react';
import './ParentSchedule.css';

/* ================= MOCK TABLES (match ERD names) ================= */
const subjects = [
    { id: 1, subject_code: 'TOAN', subject_name: 'Toán', is_active: true },
    { id: 2, subject_code: 'VAN', subject_name: 'Văn', is_active: true },
    { id: 3, subject_code: 'ANH', subject_name: 'Anh', is_active: true },
    { id: 4, subject_code: 'LY', subject_name: 'Lý', is_active: true },
    { id: 5, subject_code: 'HOA', subject_name: 'Hóa', is_active: true },
    { id: 6, subject_code: 'SU', subject_name: 'Sử', is_active: true },
    { id: 7, subject_code: 'DIA', subject_name: 'Địa', is_active: true },
    { id: 8, subject_code: 'GDCD', subject_name: 'GDCD', is_active: true }
];

const teachers = [
    { id: 101, user_id: 1001, teacher_code: 'GV101', is_active: true, full_name: 'Cô Hoa' },
    { id: 102, user_id: 1002, teacher_code: 'GV102', is_active: true, full_name: 'Thầy Nam' },
    { id: 103, user_id: 1003, teacher_code: 'GV103', is_active: true, full_name: 'Cô Lan' },
    { id: 104, user_id: 1004, teacher_code: 'GV104', is_active: true, full_name: 'Thầy Hùng' },
    { id: 105, user_id: 1005, teacher_code: 'GV105', is_active: true, full_name: 'Cô Mai' },
    { id: 106, user_id: 1006, teacher_code: 'GV106', is_active: true, full_name: 'Thầy Bình' },
    { id: 107, user_id: 1007, teacher_code: 'GV107', is_active: true, full_name: 'Cô Hạnh' },
    { id: 108, user_id: 1008, teacher_code: 'GV108', is_active: true, full_name: 'Thầy Phúc' }
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

// timetable_entries (ERD): date_of_week (1-7), start_time, end_time, subject_id, teacher_id
const timetable_entries = [
    { id: 1, timetable_id: 1, date_of_week: 2, start_time: '07:00', end_time: '07:45', subject_id: 1, teacher_id: 101 },
    { id: 2, timetable_id: 1, date_of_week: 2, start_time: '07:50', end_time: '08:35', subject_id: 2, teacher_id: 102 },
    { id: 3, timetable_id: 1, date_of_week: 3, start_time: '07:00', end_time: '07:45', subject_id: 3, teacher_id: 103 },
    { id: 4, timetable_id: 1, date_of_week: 3, start_time: '08:40', end_time: '09:25', subject_id: 4, teacher_id: 104 },
    { id: 5, timetable_id: 1, date_of_week: 4, start_time: '07:50', end_time: '08:35', subject_id: 5, teacher_id: 105 },
    { id: 6, timetable_id: 1, date_of_week: 5, start_time: '09:30', end_time: '10:15', subject_id: 6, teacher_id: 106 },
    { id: 7, timetable_id: 1, date_of_week: 6, start_time: '07:00', end_time: '07:45', subject_id: 7, teacher_id: 107 },
    { id: 8, timetable_id: 1, date_of_week: 7, start_time: '08:40', end_time: '09:25', subject_id: 8, teacher_id: 108 }
];
/* ================================================================= */

const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.full_name : 'N/A';
};

const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.subject_name : 'N/A';
};

// Ensure weekDays and periods are properly imported or defined
const weekDays = [
    { id: 2, name: 'Thứ 2', shortName: 'T2' },
    { id: 3, name: 'Thứ 3', shortName: 'T3' },
    { id: 4, name: 'Thứ 4', shortName: 'T4' },
    { id: 5, name: 'Thứ 5', shortName: 'T5' },
    { id: 6, name: 'Thứ 6', shortName: 'T6' },
    { id: 7, name: 'Thứ 7', shortName: 'T7' },
];

const periods = [
    { id: 1, name: 'Tiết 1', start_time: '07:00', end_time: '07:45', time: '07:00 - 07:45' },
    { id: 2, name: 'Tiết 2', start_time: '07:50', end_time: '08:35', time: '07:50 - 08:35' },
    { id: 3, name: 'Tiết 3', start_time: '08:40', end_time: '09:25', time: '08:40 - 09:25' },
    { id: 4, name: 'Tiết 4', start_time: '09:30', end_time: '10:15', time: '09:30 - 10:15' },
    { id: 5, name: 'Tiết 5', start_time: '10:20', end_time: '11:05', time: '10:20 - 11:05' },
];

function Schedule() {
    const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'

    // Set the current day as default selected day
    const today = new Date();
    const currentDayId = today.getDay() === 0 ? 7 : today.getDay(); // Map Sunday to 7
    const [selectedDay, setSelectedDay] = useState(currentDayId);

    // Add formatted date to weekDays
    const formattedWeekDays = weekDays.map(day => {
        const dayOffset = day.id - currentDayId;
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        return {
            ...day,
            date: date.getDate(),
            month: date.getMonth() + 1
        };
    });

    // Filter timetable data
    const getFilteredData = (date_of_week, period) => {
        return timetable_entries.find(item =>
            item.date_of_week === date_of_week &&
            item.start_time === period.start_time &&
            item.end_time === period.end_time
        );
    };

    return (
        <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
            {/* Header */}
            <div className="schedule-header card-db">
                <div className="schedule-header-left">
                    <h2 className="schedule-title">
                        <i className="fas fa-calendar-alt"></i>
                        Thời khóa biểu
                    </h2>
                    <span className="schedule-subtitle">
                        {timetable_entries.length} tiết/tuần
                    </span>
                </div>

                <div className="schedule-controls">

                    {/* View Mode Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
                            onClick={() => setViewMode('day')}
                        >
                            <i className="fas fa-calendar-day"></i>
                            Ngày
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            <i className="fas fa-calendar-week"></i>
                            Tuần
                        </button>
                    </div>
                </div>
            </div>

            {/* Day Selector (for day view) */}
            {viewMode === 'day' && (
                <div className="day-selector">
                    {formattedWeekDays.map(day => (
                        <button
                            key={day.id}
                            className={`day-btn ${selectedDay === day.id ? 'active' : ''}`}
                            onClick={() => setSelectedDay(day.id)}
                        >
                            <span className="day-name">{day.shortName}</span>
                            <span className="day-date">{day.date}/{day.month}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
                <div className="timetable-grid card-db">
                    <div className="timetable-wrapper">
                        <table className="timetable-table">
                            <thead>
                                <tr>
                                    <th className="time-header">Tiết</th>
                                    {formattedWeekDays.map(day => (
                                        <th key={day.id} className="day-header">
                                            <span className="header-day">{day.name}</span>
                                            <span className="header-date">{day.date}/{day.month}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map(period => (
                                    <tr key={period.id}>
                                        <td className="time-cell">
                                            <div className="period-info">
                                                <span className="period-name">{period.name}</span>
                                                <span className="period-time">{period.time}</span>
                                            </div>
                                        </td>
                                        {formattedWeekDays.map(day => {
                                            const lesson = getFilteredData(day.id, period);
                                            return (
                                                <td key={`${day.id}-${period.id}`} className="lesson-cell">
                                                    {lesson && (
                                                        <div className="lesson-card">
                                                            <span className="lesson-subject">{getSubjectName(lesson.subject_id)}</span>
                                                            <span className="teacher-name">{getTeacherName(lesson.teacher_id)}</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
                <div className="day-schedule card-db">
                    <div className="card-db-header">
                        <i className="fas fa-list"></i>
                        <span>
                            {formattedWeekDays.find(d => d.id === selectedDay)?.name} - {formattedWeekDays.find(d => d.id === selectedDay)?.date}/{formattedWeekDays.find(d => d.id === selectedDay)?.month}
                        </span>
                    </div>
                    <div className="card-db-body">
                        <div className="day-lessons-list">
                            {periods.map(period => {
                                const lesson = getFilteredData(selectedDay, period);
                                return (
                                    <div
                                        key={period.id}
                                        className={`day-lesson-item ${lesson ? 'has-lesson' : 'free'}`}
                                    >
                                        <div className="lesson-time">
                                            <span className="period-number">{period.name}</span>
                                            <span className="period-hours">{period.time}</span>
                                        </div>
                                        <div className="lesson-content">
                                            {lesson ? (
                                                <>
                                                    <div className="lesson-main">
                                                        <span className="subject-name">{getSubjectName(lesson.subject_id)}</span>
                                                        <span className="teacher-name">{getTeacherName(lesson.teacher_id)}</span>
                                                    </div>
                                                    <div className="lesson-meta">
                                                        <span className="room-info">Tiết {period.name}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="free-text">Không có tiết</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}

        </div>
    );
}

export default Schedule;
