import { Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/Components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Admin Content */}
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;