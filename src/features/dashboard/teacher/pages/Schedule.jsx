import { useState } from 'react';
import './Schedule.css';

// Mock data - Danh sách lớp giáo viên đang dạy
const teachingClasses = [
    { id: 1, className: '6A', grade: 'Khối 6' },
    { id: 2, className: '6B', grade: 'Khối 6' },
    { id: 3, className: '7A', grade: 'Khối 7' },
    { id: 4, className: '7B', grade: 'Khối 7' },
];

// Thời gian các tiết học
const periods = [
    { id: 1, name: 'Tiết 1', time: '07:00 - 07:45' },
    { id: 2, name: 'Tiết 2', time: '07:50 - 08:35' },
    { id: 3, name: 'Tiết 3', time: '08:40 - 09:25' },
    { id: 4, name: 'Tiết 4', time: '09:30 - 10:15' },
    { id: 5, name: 'Tiết 5', time: '10:20 - 11:05' },
];

// Các ngày trong tuần
const weekDays = [
    { id: 2, name: 'Thứ 2', shortName: 'T2' },
    { id: 3, name: 'Thứ 3', shortName: 'T3' },
    { id: 4, name: 'Thứ 4', shortName: 'T4' },
    { id: 5, name: 'Thứ 5', shortName: 'T5' },
    { id: 6, name: 'Thứ 6', shortName: 'T6' },
    { id: 7, name: 'Thứ 7', shortName: 'T7' },
];

// Mock data - Thời khóa biểu
const timetableData = [
    // Thứ 2
    { dayId: 2, periodId: 1, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 2, periodId: 2, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 2, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    // Thứ 3
    { dayId: 3, periodId: 1, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 3, periodId: 3, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 3, periodId: 5, subject: 'Toán', className: '6B', room: 'P.202' },
    // Thứ 4
    { dayId: 4, periodId: 2, subject: 'Toán', className: '7A', room: 'P.301' },
    { dayId: 4, periodId: 3, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 4, periodId: 5, subject: 'Toán', className: '6A', room: 'P.201' },
    // Thứ 5
    { dayId: 5, periodId: 1, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 5, periodId: 2, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 5, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    // Thứ 6
    { dayId: 6, periodId: 1, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 6, periodId: 3, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 6, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    // Thứ 7
    { dayId: 7, periodId: 2, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 7, periodId: 3, subject: 'Toán', className: '7B', room: 'P.302' },
];

function Schedule() {
    const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
    const [selectedDay, setSelectedDay] = useState(getCurrentDayId());
    const [selectedClass, setSelectedClass] = useState('all');

    // Get current day of week (2-7, with 2 being Monday)
    function getCurrentDayId() {
        const day = new Date().getDay();
        return day === 0 ? 2 : (day === 1 ? 2 : day + 1); // Map Sunday to Monday
    }

    // Get current week dates
    function getWeekDates() {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

        return weekDays.map((day, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            return {
                ...day,
                date: date.getDate(),
                month: date.getMonth() + 1,
                isToday: date.toDateString() === today.toDateString(),
            };
        });
    }

    const weekDates = getWeekDates();

    // Filter timetable data
    const getFilteredData = (dayId, periodId) => {
        return timetableData.find(item => {
            const dayMatch = item.dayId === dayId;
            const periodMatch = item.periodId === periodId;
            const classMatch = selectedClass === 'all' || item.className === selectedClass;
            return dayMatch && periodMatch && classMatch;
        });
    };

    // Get lessons for a specific day
    const getDayLessons = (dayId) => {
        return timetableData.filter(item => {
            const classMatch = selectedClass === 'all' || item.className === selectedClass;
            return item.dayId === dayId && classMatch;
        });
    };

    // Count total lessons
    const totalLessons = timetableData.filter(item =>
        selectedClass === 'all' || item.className === selectedClass
    ).length;

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
                        {totalLessons} tiết/tuần
                    </span>
                </div>

                <div className="schedule-controls">
                    {/* Class Filter */}
                    <div className="control-group">
                        <label>Lọc theo lớp:</label>
                        <select
                            className="form-select"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="all">Tất cả lớp</option>
                            {teachingClasses.map(cls => (
                                <option key={cls.id} value={cls.className}>
                                    {cls.className} - {cls.grade}
                                </option>
                            ))}
                        </select>
                    </div>

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
                    {weekDates.map(day => (
                        <button
                            key={day.id}
                            className={`day-btn ${selectedDay === day.id ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
                            onClick={() => setSelectedDay(day.id)}
                        >
                            <span className="day-name">{day.shortName}</span>
                            <span className="day-date">{day.date}/{day.month}</span>
                            {day.isToday && <span className="today-badge">Hôm nay</span>}
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
                                    {weekDates.map(day => (
                                        <th
                                            key={day.id}
                                            className={`day-header ${day.isToday ? 'today' : ''}`}
                                        >
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
                                        {weekDates.map(day => {
                                            const lesson = getFilteredData(day.id, period.id);
                                            return (
                                                <td
                                                    key={`${day.id}-${period.id}`}
                                                    className={`lesson-cell ${lesson ? 'has-lesson' : ''} ${day.isToday ? 'today' : ''}`}
                                                >
                                                    {lesson && (
                                                        <div className="lesson-card">
                                                            <span className="lesson-subject">{lesson.subject}</span>
                                                            <span className="lesson-class">{lesson.className}</span>
                                                            <span className="lesson-room">
                                                                <i className="fas fa-door-open"></i>
                                                                {lesson.room}
                                                            </span>
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
                            {weekDates.find(d => d.id === selectedDay)?.name} - {weekDates.find(d => d.id === selectedDay)?.date}/{weekDates.find(d => d.id === selectedDay)?.month}
                        </span>
                    </div>
                    <div className="card-db-body">
                        <div className="day-lessons-list">
                            {periods.map(period => {
                                const lesson = getFilteredData(selectedDay, period.id);
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
                                                        <span className="subject-name">{lesson.subject}</span>
                                                        <span className="class-badge">{lesson.className}</span>
                                                    </div>
                                                    <div className="lesson-meta">
                                                        <span className="room-info">
                                                            <i className="fas fa-door-open"></i>
                                                            {lesson.room}
                                                        </span>
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
            <div className="schedule-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-book"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalLessons}</span>
                        <span className="stat-label">Tổng tiết/tuần</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-chalkboard"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{teachingClasses.length}</span>
                        <span className="stat-label">Lớp giảng dạy</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{getDayLessons(selectedDay).length}</span>
                        <span className="stat-label">Tiết hôm nay</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
