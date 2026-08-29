import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const menuItems = [
   
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Return Requests",
      path: "/admin/return-requests",
      icon: "🔄",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white fixed left-0 top-0">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-5 left-4 right-4">
        <button className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700">
          Logout
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;