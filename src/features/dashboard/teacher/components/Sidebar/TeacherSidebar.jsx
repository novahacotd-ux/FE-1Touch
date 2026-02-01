import { NavLink } from "react-router-dom";
import './TeacherSidebar.css';
import { useState } from "react";
import { useLanguage } from '../../../../../context/useLanguage';
import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiClipboard,
    FiGrid,
    FiUser,
    FiBell,
    FiBarChart2,
    FiMenu,
} from 'react-icons/fi';

const TeacherSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { t } = useLanguage();

    const menu = [
        { key: 'dashboard', path: '/teacher', label: t('dashboard') || 'Dashboard', icon: <FiHome />, end: true },
        { key: 'schedule', path: '/teacher/schedule', label: t('Schedule') || 'Lịch dạy', icon: <FiCalendar /> },
        { key: 'teachingClasses', path: '/teacher/teaching-classes', label: t('Teaching Classes') || 'Lớp giảng dạy', icon: <FiUsers /> },
        { key: 'attendance', path: '/teacher/attendance', label: t('attendance') || 'Điểm danh', icon: <FiClipboard /> },
        { key: 'seatingChart', path: '/teacher/seating-chart', label: t('Seating Chart') || 'Sơ đồ chỗ ngồi', icon: <FiGrid /> },
        { key: 'students', path: '/teacher/students', label: t('students') || 'Học sinh', icon: <FiUser /> },
        { key: 'announcements', path: '/teacher/announcements', label: t('Announcements') || 'Thông báo', icon: <FiBell /> },
        { key: 'reports', path: '/teacher/reports', label: t('Reports') || 'Báo cáo', icon: <FiBarChart2 /> },
    ];

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="admin-sidebar-logo">
                <button
                    className="admin-sidebar-toggle"
                    onClick={() => setCollapsed(prev => !prev)}
                    aria-label="Toggle sidebar"
                >
                    <FiMenu />
                </button>
                {!collapsed && <span>{t('teacherPortal') || 'Teacher Portal'}</span>}
            </div>

            <nav className="admin-sidebar-menu">
                {menu.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `admin-sidebar-menu-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="admin-sidebar-item-icon">
                            {item.icon}
                        </span>
                        <span className="admin-sidebar-item-text">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default TeacherSidebar;
