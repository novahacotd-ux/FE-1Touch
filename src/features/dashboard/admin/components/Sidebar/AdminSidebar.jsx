import { NavLink } from "react-router-dom";
import './AdminSidebar.css';
import { useState } from "react";
import { useLanguage } from '../../../../../context/useLanguage';
import {
    FiHome,
    FiUsers,
    FiBook,
    FiLayers,
    FiClipboard,
    FiCalendar,
    FiSettings,
    FiBarChart2,
    FiFileText,
    FiMenu,
} from 'react-icons/fi';

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { t } = useLanguage();
    
    const menu = [
        { key: 'dashboard', path: '/admin', label: t('dashboard'), icon: <FiHome /> },
        { key: 'teacher', path: '/admin/teacher', label: t('teacher'), icon: <FiUsers /> },
        { key: 'classes', path: '/admin/classes', label: t('classes'), icon: <FiBook /> },
        { key: 'subject', path: '/admin/subject', label: t('subject'), icon: <FiLayers /> },
        { key: 'assignments', path: '/admin/assignments', label: t('assignments'), icon: <FiClipboard /> },
        { key: 'timetable', path: '/admin/timetable', label: t('timetable'), icon: <FiCalendar /> },
        { key: 'systemConfig', path: '/admin/systemConfig', label: t('systemConfig'), icon: <FiSettings /> },
        { key: 'statistics', path: '/admin/statistics', label: t('statistics'), icon: <FiBarChart2 /> },
        { key: 'auditLogs', path: '/admin/auditLogs', label: t('auditLogs'), icon: <FiFileText /> }
    ]
    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="admin-sidebar-logo">
                <button className="admin-sidebar-toggle"
                onClick={() => setCollapsed(prev => !prev)}
                aria-label="Toggle sidebar"
                >
                    <FiMenu />
                </button>
                {!collapsed && <span>{t('fingerprintPro')}</span>}
            </div>

            <nav className="admin-sidebar-menu">
                {menu.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.path}
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

export default AdminSidebar;