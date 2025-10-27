import { FaUsers } from "react-icons/fa6";
import PageLayout from "../components/pageLoyout";
import { IoPersonAdd } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import RegisterForm from "../auth/RegisterForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import type { RootState } from "../../store";
import type { user, User } from "../types";

import ProfileEditModal from "../components/profileEdit";
import { deleteUser, getAllUser } from "../../api/adminApi";
import { updateProfile } from "../../api/authApi";

export default function Employees() {
  const [pop, setPop] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editProfile, setEditProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  // Fetch all users
  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUsers = async () => {
      try {
        const res = await getAllUser(auth.token);

        // Optional: filter out admins if needed
        const filteredUsers = res.data.filter((u: User) => u.role !== "admin");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [auth?.token, navigate]);

  // Handle profile update
  const handleProfileSubmit = async (data: Partial<user>) => {
    try {
      await updateProfile(auth.token, data);

      const userFound = users.find((user) => user._id === data.id);
      if (!userFound) return;

      const updatedUser: User = {
        ...userFound,
        fname: data.fname ?? userFound.fname,
        lname: data.lname ?? userFound.lname,
        department: data.department ?? userFound.department,
      };

      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );

    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  const handleUserDelete = async (id: string) => {
    try {
      await deleteUser(auth.token, id);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };







  // Open edit modal
  const onEdit = (id: string) => {
    const userFound = users.find(u => u._id === id);

    const selectedUser: user | null = userFound
      ? {
        ...userFound,
        id: userFound._id,
        role: userFound.role as "admin" | "employee", // cast role
      }
      : null;

    setSelectedUser(selectedUser);
    setEditProfile(true);
  };



  return (
    <PageLayout>
      <div className="w-full mt-2 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-4 items-center">
            <FaUsers className="text-3xl md:text-4xl xl:text-5xl text-black" />
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-[500] text-[#2b2d42]">
              Employees
            </h1>
          </div>

          <button
            onClick={() => setPop(true)}
            className="flex gap-2 items-center justify-center py-2 px-4 w-full md:w-auto bg-blue-500 text-white font-medium rounded border border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
          >
            <IoPersonAdd className="text-lg" />
            Add Employee
          </button>
        </div>

        {/* Add Employee Modal */}
        {pop && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="relative w-11/12 md:w-2/3 xl:w-1/3 bg-white rounded-2xl h-[90%] overflow-auto shadow-2xl p-9">
              <button
                onClick={() => setPop(false)}
                className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl"
              >
                ✕
              </button>

              <h1 className="text-3xl font-bold text-center mb-5 text-[#2b2d42]">
                Add Employee
              </h1>

              <RegisterForm />
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm text-center">
              <th className="px-4 py-3 border-b">ID</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Team</th>
              <th className="px-4 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user._id}
                className="border-b border-b-gray-300 hover:bg-gray-50 transition-colors text-center"
              >
                <td className="px-1 py-3 font-semibold text-gray-700">{user._id}</td>
                <td className="px-4 py-3 capitalize">{user.fname} {user.lname}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {user.department}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(user._id)}
                    className="p-2 rounded-lg border border-blue-400 text-blue-500 hover:bg-blue-100"
                  >
                    <AiOutlineEdit size={18} />
                  </button>
                  <button onClick={() => {
                    handleUserDelete(user._id)
                  }} className="p-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-100">
                    <AiOutlineDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Profile Modal */}
      {editProfile && selectedUser && (
        <ProfileEditModal
          user={selectedUser}
          onClose={() => setEditProfile(false)}
          onUpdate={handleProfileSubmit}
        />
      )}
    </PageLayout>
  );
}
