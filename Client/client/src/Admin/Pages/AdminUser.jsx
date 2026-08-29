import { useEffect, useState } from "react";
import {
  FiUsers,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import { getAllUsersAPI } from "../../Services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await getAllUsersAPI();

        console.log("ALL USERS:", response.data);

        setUsers(response.data.users || []);
      } catch (error) {
        console.error(
          "Failed to fetch users:",
          error.response?.data || error.message
        );

        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Users
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage all registered users.
        </p>
      </div>

      {/* TOTAL USERS */}

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#B87575]/10 text-[#B87575]">
          <FiUsers size={21} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <p className="text-xl font-bold text-gray-800">
            {users.length}
          </p>
        </div>
      </div>

      {/* USERS TABLE */}

      {users.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">
            No users found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  User
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Email
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Role
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* USER */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B87575]/10 font-semibold text-[#B87575]">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.name || "Unknown"}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail size={15} />

                      {user.email || "-"}
                    </div>
                  </td>

                  {/* PHONE */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone size={15} />

                      {user.PhoneNumber || "-"}
                    </div>
                  </td>

                  {/* ROLE */}

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        user.role === "admin"
                          ? "bg-[#B87575]/10 text-[#B87575]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>

                  {/* JOINED DATE */}

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;