import { Route, Routes } from "react-router-dom";
import AdminLayout from "../features/dashboard/admin/layouts/AdminLayout.jsx";
import SignIn from "../features/auth/pages/SignIn";
import TeacherLayout from "../features/dashboard/teacher/layouts/TeacherLayout.jsx";
import AdminDashboard from "../features/dashboard/admin/pages/AdminDashboard";
import AdminTeacherTab from "../features/teachers/pages/AdminTeacherTab";
import AdminClasses from "../features/classes/pages/AdminClasses";
import AdminStudents from "../features/students/pages/AdminStudents";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="teachers" element={<AdminTeacherTab />} />
                <Route path="classes" element={<AdminClasses />} />
                <Route path="students" element={<AdminStudents />} />
            </Route>
            <Route path="/teacher" element={<TeacherLayout pageTitle="Dashboard" />}>
                <Route index element={<div className="p-4"><h2>Dashboard</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/schedule"
                element={
                    <TeacherLayout pageTitle="Schedule" />
                }
            >
                <Route index element={<div className="p-4"><h2>Schedule</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/teaching-classes"
                element={
                    <TeacherLayout pageTitle="Teaching Classes" />
                }
            >
                <Route index element={<div className="p-4"><h2>Teaching Classes</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/attendance"
                element={
                    <TeacherLayout pageTitle="Attendance" />
                }
            >
                <Route index element={<div className="p-4"><h2>Attendance</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/seating-chart"
                element={
                    <TeacherLayout pageTitle="Seating Chart" />
                }
            >
                <Route index element={<div className="p-4"><h2>Seating Chart</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/students"
                element={
                    <TeacherLayout pageTitle="Students" />
                }
            >
                <Route index element={<div className="p-4"><h2>Students</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/announcements"
                element={
                    <TeacherLayout pageTitle="Announcements" />
                }
            >
                <Route index element={<div className="p-4"><h2>Announcements</h2><p>Coming soon...</p></div>} />
            </Route>

            <Route
                path="/teacher/reports"
                element={
                    <TeacherLayout pageTitle="Reports" />
                }
            >
                <Route index element={<div className="p-4"><h2>Reports</h2><p>Coming soon...</p></div>} />
                <Route index element={<AdminDashboard />} />
                
            </Route>
        </Routes>
    );
};

export default AppRoutes;
