import { Outlet } from 'react-router-dom';
import TeacherSidebar from '../components/Sidebar/TeacherSidebar';
import TeacherHeader from '../components/Header/TeacherHeader';
import './TeacherLayout.css';

const TeacherLayout = () => {
    return (
        <div className="admin-layout">
            <TeacherSidebar />
            <div className="admin-layout-main">
                <TeacherHeader />
                <div className="admin-layout-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default TeacherLayout;
