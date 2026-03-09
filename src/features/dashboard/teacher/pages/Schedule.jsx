// Schedule.jsx
import { useState } from 'react';
import {
    FiCalendar,
    FiClock,
    FiBook,
    FiUsers,
    FiGrid,
    FiList,
} from 'react-icons/fi';
import './Schedule.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Select from '../../admin/components/ui/Select';

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
    { dayId: 2, periodId: 1, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 2, periodId: 2, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 2, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    { dayId: 3, periodId: 1, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 3, periodId: 3, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 3, periodId: 5, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 4, periodId: 2, subject: 'Toán', className: '7A', room: 'P.301' },
    { dayId: 4, periodId: 3, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 4, periodId: 5, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 5, periodId: 1, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 5, periodId: 2, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 5, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    { dayId: 6, periodId: 1, subject: 'Toán', className: '7B', room: 'P.302' },
    { dayId: 6, periodId: 3, subject: 'Toán', className: '6B', room: 'P.202' },
    { dayId: 6, periodId: 4, subject: 'Toán', className: '7A', room: 'P.301' },
    { dayId: 7, periodId: 2, subject: 'Toán', className: '6A', room: 'P.201' },
    { dayId: 7, periodId: 3, subject: 'Toán', className: '7B', room: 'P.302' },
];

function Schedule() {
    const [viewMode, setViewMode] = useState('week');
    const [selectedDay, setSelectedDay] = useState(getCurrentDayId());
    const [selectedClass, setSelectedClass] = useState('all');

    function getCurrentDayId() {
        const day = new Date().getDay();
        return day === 0 ? 2 : (day === 1 ? 2 : day + 1);
    }

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

    const getFilteredData = (dayId, periodId) => {
        return timetableData.find(item => {
            const dayMatch = item.dayId === dayId;
            const periodMatch = item.periodId === periodId;
            const classMatch = selectedClass === 'all' || item.className === selectedClass;
            return dayMatch && periodMatch && classMatch;
        });
    };

    const getDayLessons = (dayId) => {
        return timetableData.filter(item => {
            const classMatch = selectedClass === 'all' || item.className === selectedClass;
            return item.dayId === dayId && classMatch;
        });
    };

    const totalLessons = timetableData.filter(item =>
        selectedClass === 'all' || item.className === selectedClass
    ).length;

    const classOptions = [
        { value: 'all', label: 'Tất cả lớp' },
        ...teachingClasses.map(cls => ({ value: cls.className, label: `${cls.className} - ${cls.grade}` }))
    ];

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiCalendar />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Thời khóa biểu</div>
                        <div className="sub">{totalLessons} tiết/tuần</div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="filterRow">
                        <div className="filter">
                            <div className="filterLabel">
                                <FiUsers /> Lọc theo lớp
                            </div>
                            <Select
                                value={selectedClass}
                                onChange={setSelectedClass}
                                options={classOptions}
                            />
                        </div>

                        <div className="view-toggle">
                            <button
                                className={`chip ${viewMode === 'day' ? 'chip--on' : ''}`}
                                onClick={() => setViewMode('day')}
                            >
                                <FiList /> Ngày
                            </button>
                            <button
                                className={`chip ${viewMode === 'week' ? 'chip--on' : ''}`}
                                onClick={() => setViewMode('week')}
                            >
                                <FiGrid /> Tuần
                            </button>
                        </div>
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
                <Card
                    title="Lịch tuần"
                    icon={<FiGrid />}
                    subtitle="Xem tổng quan thời khóa biểu trong tuần"
                    right={<Pill tone="info">{totalLessons} tiết</Pill>}
                >
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
                </Card>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
                <Card
                    title={`${weekDates.find(d => d.id === selectedDay)?.name} - ${weekDates.find(d => d.id === selectedDay)?.date}/${weekDates.find(d => d.id === selectedDay)?.month}`}
                    icon={<FiList />}
                    subtitle="Lịch dạy trong ngày"
                    right={<Pill tone="info">{getDayLessons(selectedDay).length} tiết</Pill>}
                >
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
                                                    <span className="tag tag--info">{lesson.className}</span>
                                                </div>
                                                <div className="lesson-meta">
                                                    <span className="tag tag--muted">{lesson.room}</span>
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
                </Card>
            )}

            {/* Summary Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon"><FiBook /></div>
                    <div>
                        <div className="factValue">{totalLessons}</div>
                        <div className="factLabel">Tổng tiết/tuần</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon"><FiUsers /></div>
                    <div>
                        <div className="factValue">{teachingClasses.length}</div>
                        <div className="factLabel">Lớp giảng dạy</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon"><FiClock /></div>
                    <div>
                        <div className="factValue">{getDayLessons(selectedDay).length}</div>
                        <div className="factLabel">Tiết hôm nay</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
