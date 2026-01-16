import { Outlet } from "react-router-dom";
import AdminHeader from "../components/Header/AdminHeader";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import './AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout-main">
                <AdminHeader />
                <div className="admin-layout-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;