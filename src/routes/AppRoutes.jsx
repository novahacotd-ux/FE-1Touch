import { Route, Routes } from "react-router-dom";
import AdminLayout from "../features/dashboard/admin/layouts/AdminLayout.jsx";
import SignIn from "../features/auth/pages/SignIn";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />

            <Route path="/admin" element={<AdminLayout />}>
                {/* <Route index element={<Dashboard />} /> */}
                
            </Route>
        </Routes>
    );
};

export default AppRoutes;
