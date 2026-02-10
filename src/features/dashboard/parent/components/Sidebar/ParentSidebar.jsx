import { NavLink } from "react-router-dom";
import './ParentSidebar.css';
import { useState } from "react";
import { useLanguage } from '../../../../../context/useLanguage';
import {
    FiHome,
    FiCalendar,
    FiCheckCircle,
    FiFileText,
    FiUser,
    FiBell,
    FiMenu,
} from 'react-icons/fi';

const ParentSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { t } = useLanguage();
    
    // Using hardcoded labels for now if translations keys don't exist yet, 
    // or fallbacking to keys that likely exist.
    const menu = [
        { key: 'dashboard', path: '/parent', label: t('dashboard'), icon: <FiHome />, end: true },
        { key: 'timetable', path: '/parent/schedule', label: t('timetable'), icon: <FiCalendar /> },
        { key: 'attendance', path: '/parent/attendance', label: t('attendance'), icon: <FiCheckCircle /> },
        { key: 'leave', path: '/parent/leave-request', label: t('leaveRequests'), icon: <FiFileText /> },
        { key: 'student', path: '/parent/student-profile', label: t('studentProfile'), icon: <FiUser /> },
        { key: 'notifications', path: '/parent/notifications', label: t('notifications'), icon: <FiBell /> },
    ]

    return (
        <aside className={`parent-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="parent-sidebar-logo">
                <button className="parent-sidebar-toggle"
                onClick={() => setCollapsed(prev => !prev)}
                aria-label="Toggle sidebar"
                >
                    <FiMenu />
                </button>
                {!collapsed && <span>{t('parentPortal')}</span>}
            </div>

            <nav className="parent-sidebar-menu">
                {menu.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `parent-sidebar-menu-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="parent-sidebar-item-icon">
                            {item.icon}
                        </span>
                        <span className="parent-sidebar-item-text">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default ParentSidebar;
