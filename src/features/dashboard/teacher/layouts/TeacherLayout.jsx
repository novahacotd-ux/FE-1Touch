import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from '../components/Sidebar/TeacherSidebar';
import TeacherHeader from '../components/Header/TeacherHeader';
import './TeacherLayout.css';

const TeacherLayout = ({ pageTitle = 'Dashboard' }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={`dashboard-app ${isSidebarOpen ? 'sidebar-active' : ''} ${isSidebarCollapsed ? 'sidebar-passive' : ''}`}>
            <TeacherSidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
            />

            <TeacherHeader
                onMenuToggle={toggleSidebar}
                pageTitle={pageTitle}
            />

            <main className="app-content">
                <Outlet />
            </main>

            <nav className="bottom-bar">
                <div className="bottom-item">
                    <a href="/dashboard">
                        <i className="fas fa-home"></i>
                        <span>Dashboard</span>
                    </a>
                </div>
                <div className="bottom-item">
                    <a href="/orders">
                        <i className="fas fa-shopping-bag"></i>
                        <span>Orders</span>
                    </a>
                </div>
                <div className="bottom-item bottom-center">
                    <a href="/dashboard">
                        <i className="fas fa-plus"></i>
                    </a>
                </div>
                <div className="bottom-item">
                    <a href="/addfunds">
                        <i className="fas fa-wallet"></i>
                        <span>Funds</span>
                    </a>
                </div>
                <div className="bottom-item">
                    <a href="/support">
                        <i className="fas fa-headset"></i>
                        <span>Support</span>
                    </a>
                </div>
            </nav>
        </div>
    );
};

export default TeacherLayout;
