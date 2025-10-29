import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type JSX } from "react";
import { getUsersByRole } from "../../api/adminApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Task, UserWithTaskCount } from "../types";
import PopUpForm from "./popUpForm";
import {
  createTask,
  deleteTask,
  statusChangeTask,
  updateTask,
} from "../../api/taskApi";
import {
  FaAndroid,
  FaApple,
  FaArrowLeftLong,
  FaGlobe,
  FaPalette,
  FaSpinner,
  FaUsers,
} from "react-icons/fa6";
import PageLayout from "../components/pageLoyout";
import UserTaskCard from "./UserTaskCard";

export default function UsersView() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const dept = queryParams.get("dept");
  const hasFetched = useRef<string | null>(null);
  const [users, setUsers] = useState<UserWithTaskCount[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const [selectedUser, setSelectedUser] = useState<UserWithTaskCount | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!dept || !auth?.token) return;
    setLoading(true);
    try {
      const res = await getUsersByRole(auth.token, dept);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.token) navigate("/login");
    if (!dept || !auth?.token) return;
    if (hasFetched.current === dept) return;
    hasFetched.current = dept;
    fetchUsers();
  }, [dept, auth?.token]);

  const handleSubmit = async (data: Task) => {
    if (!auth?.token || !auth?.user || !selectedUser?._id) return;

    try {
      const task = {
        ...data,
        adminId: auth.user.id,
        userId: selectedUser._id,
      };

      const res = await createTask(auth.token, task);

      if (res?.task) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  tasks: [...(user.tasks || []), res.task],
                  totalTasks: (user.totalTasks || 0) + 1,
                }
              : user
          )
        );
      }

      setSelectedUser(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDelete = async (
    id: string | null | undefined,
    userId?: string
  ) => {
    if (!id || !userId) return;
    if (!auth?.token) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              tasks: user.tasks.filter((task) => task._id !== id),
              totalTasks: user.totalTasks - 1,
              completedTasks:
                user.completedTasks -
                (user.tasks.find(
                  (task) => task._id === id && task.status === "completed"
                )
                  ? 1
                  : 0),
            }
          : user
      )
    );
    try {
      await deleteTask(auth.token, id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusToggle = async (
    taskId: string | null | undefined,
    userId: string,
    currentStatus: "completed" | "pending"
  ) => {
    if (!taskId || !userId) return;

    const newStatus: "completed" | "pending" =
      currentStatus === "completed" ? "pending" : "completed";

    const statusChangeRole: "none" | "admin" | "employee" =
      auth.user?.role === "admin" ? "admin" : "employee"; // determine role dynamically
    // ✅ Update local state immediately with recalculated stats
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id !== userId) return user;

        // Update tasks
        const updatedTasks = user.tasks.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        );

        // Recalculate task stats
        const totalTasks = updatedTasks.length;
        const completedTasks = updatedTasks.filter(
          (t) => t.status === "completed"
        ).length;
        const completionPercentage =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...user,
          tasks: updatedTasks,
          totalTasks,
          completedTasks,
          completionPercentage,
        };
      })
    );

    try {
      // ✅ Call API to update task status
      await statusChangeTask(
        auth.token,
        taskId,
        newStatus,
        statusChangeRole,
        auth.user?.id
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleTitleEdit = async (
    taskId: string | null | undefined,
    userId: string,
    task: Task
  ) => {
    if (!taskId || !auth?.token) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              tasks: user.tasks.map((t) =>
                t._id === taskId ? { ...t, title: editValue } : t
              ),
            }
          : user
      )
    );
    // Create updated task object
    const updatedTask = { ...task, title: editValue };
    try {
      // Update on backend
      await updateTask(auth.token, taskId, updatedTask);

      // Update on frontend

      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDrop = (index: number, userId: string) => {
    if (draggedIndex === null) return;
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id !== userId) return user;
        const updatedTasks = [...user.tasks];
        const [moved] = updatedTasks.splice(draggedIndex, 1);
        updatedTasks.splice(index, 0, moved);
        return { ...user, tasks: updatedTasks };
      })
    );
    setDraggedIndex(null);
  };

  const deptIcons: Record<string, JSX.Element> = {
    "Web Development": (
      <FaGlobe className="text-3xl md:text-4xl xl:text-5xl text-blue-600" />
    ),
    "Android Development": (
      <FaAndroid className="text-3xl md:text-4xl xl:text-5xl text-green-600" />
    ),
    "iOS Development": (
      <FaApple className="text-3xl md:text-4xl xl:text-5xl text-black" />
    ),
    Designing: (
      <FaPalette className="text-3xl md:text-4xl xl:text-5xl text-blue-500" />
    ),
    Employees: (
      <FaUsers className="text-3xl md:text-4xl xl:text-5xl text-[#2b2d42]" />
    ),
  };

  return (
    <PageLayout>
      <div className="w-full mt-5 xl:mt-2">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-4 items-center">
            {deptIcons[dept || ""]}
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-[500] text-[#2b2d42]">
              {dept ? `${dept} Team` : "Team"}
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="flex gap-2 items-center justify-center px-4 py-2 w-1/2 md:w-1/3 lg:w-1/4 bg-gray-50 text-gray-700 font-medium rounded border border-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
          >
            <FaArrowLeftLong />
            Back to Dashboard
          </Link>
        </div>

        {/* 👇 Conditional rendering for loading/error/data */}
        {loading ? (
          <div className="w-full flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-medium">
            No users found for this department.
          </div>
        ) : (
          <>
            {users.map((user) => (
              <UserTaskCard
                key={user._id}
                user={user}
                setSelectedUser={setSelectedUser}
                editingId={editingId}
                editValue={editValue}
                setEditingId={setEditingId}
                setEditValue={setEditValue}
                handleTitleEdit={handleTitleEdit}
                handleStatusToggle={handleStatusToggle}
                handleDelete={handleDelete}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
              />
            ))}

            {selectedUser && (
              <PopUpForm
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSubmit={handleSubmit}
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
