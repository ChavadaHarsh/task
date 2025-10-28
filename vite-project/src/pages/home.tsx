import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import PageLayout from "./components/pageLoyout";
import {
  getUserById,
  updateTask,
  statusChangeTask,
  deleteTask,
  createTask,
} from "../api/taskApi";
import { useEffect, useRef, useState } from "react";
import UserTaskCard from "./admin/UserTaskCard";
import PopUpForm from "./admin/popUpForm";
import type { Task, user, UserWithTaskCount } from "./types";
import ProfileEditModal from "./components/profileEdit";
import { updateProfile } from "../api/authApi";
import { updateUser } from "../store/slices/authSlice";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState<UserWithTaskCount | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [togglePopForm, setTogglePopForm] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);

  useEffect(() => {
    if (auth.user?.role === "admin") {
      navigate("/dashboard");
      return;
    }
    if (!auth.token) {
      navigate("/login");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchUser();
  }, [auth.token, auth.user?.id, navigate]);
  // Fetch user data from backend
  const fetchUser = async () => {
    if (!auth.token || !auth.user?.id) return;

    try {
      setIsFetchingUser(true);
      const res = await getUserById(auth.token, auth.user.id);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setIsFetchingUser(false);
    }
  };

  // Handle new task creation
  const handleSubmit = async (data: Task) => {
    if (!auth?.token || !auth?.user) return;

    const task: Task = {
      ...data,
      createDepartment: auth.user.department || "",
      adminId: null,
      userId: auth.user.id || "",
    };

    try {
      setIsLoading(true); // 🔥 Start loader

      const res = await createTask(auth.token, task);

      if (res?.task) {
        setUserData((prev) => {
          if (!prev) return prev;
          return { ...prev, task: res.task };
        });
      }

      await fetchUser();
      setTogglePopForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Task title edit
  const handleTitleEdit = async (
    taskId: string | null,
    userId: string,
    task: Task
  ) => {
    if (!auth?.token || !userData || !userId) return;

    const updatedTask: Task = { ...task, title: editValue };
    try {
      await updateTask(auth.token, taskId, updatedTask);

      const updatedTasks = userData.tasks.map((t) =>
        t._id === taskId ? { ...t, title: editValue } : t
      );

      setUserData({ ...userData, tasks: updatedTasks });
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  // Task status toggle
  const handleStatusToggle = async (
    taskId: string | null,
    userId: string,
    currentStatus: "completed" | "pending"
  ) => {
    if (!auth?.token || !userData || !userId) return;

    const newStatus: "completed" | "pending" =
      currentStatus === "completed" ? "pending" : "completed";
    const role: "admin" | "employee" =
      auth.user?.role === "admin" ? "admin" : "employee";

    const updatedTasks = userData.tasks.map((t) =>
      t._id === taskId ? { ...t, status: newStatus } : t
    );
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setUserData({
      ...userData,
      tasks: updatedTasks,
      totalTasks,
      completedTasks,
      completionPercentage,
    });

    try {
      await statusChangeTask(
        auth.token,
        taskId,
        newStatus,
        role,
        auth.user?.id
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete task
  const handleDelete = async (taskId: string | null) => {
    if (!auth?.token || !userData) return;
    const updatedTasks = userData.tasks.filter((t) => t._id !== taskId);
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setUserData({
      ...userData,
      tasks: updatedTasks,
      totalTasks,
      completedTasks,
      completionPercentage,
    });

    try {
      await deleteTask(auth.token, taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Drag and drop
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDrop = (index: number) => {
    if (draggedIndex === null || !userData) return;

    const updatedTasks = [...userData.tasks];
    const [moved] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(index, 0, moved);

    setUserData({ ...userData, tasks: updatedTasks });
    setDraggedIndex(null);
  };

  if (!userData) return null;

  const handleProfileSubmit = async (data: Partial<user>) => {
    try {
      setIsProfileLoading(true);
      const res = await updateProfile(auth.token, data);

      if (res.message && res.data) {
        // Update Redux state
        dispatch(
          updateUser({
            fname: res.data.fname,
            lname: res.data.lname,
            email: res.data.email,
          })
        );

        // Update local component state
        setUserData((prev) => {
          if (!prev) return prev; // handle null state

          return {
            ...prev,
            fname: res.data.fname,
            lname: res.data.lname,
            email: res.data.email,
          };
        });
      }
    } catch (error: any) {
      console.error("Error while updating profile:", error);
      alert(error.message);
    } finally {
      setIsProfileLoading(false);
    }
  };
  if (isFetchingUser) {
    return (
      <PageLayout>
        <div className="w-full flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-5xl text-purple-600" />
        </div>
      </PageLayout>
    );
  }

  if (!userData) return null;

  return (
    <PageLayout>
      {isProfileLoading ? (
        <div className="w-full flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center mt-2 px-5">
            <button onClick={() => setEditProfile(true)} title="EditProfile">
              <h1 className="text-2xl font-[700] text-gray-600 flex items-center gap-2 capitalize cursor-pointer">
                {auth?.user?.fname || "No role found"}{" "}
                {auth?.user?.lname || "No role found"}
              </h1>
            </button>
            <button
              onClick={() => setTogglePopForm(true)}
              className="bg-purple-600 text-white px-4 py-2 cursor-pointer rounded font-medium shadow hover:bg-purple-700 transition"
            >
              + Add Task
            </button>
          </div>

          {/* User Task Section */}
          <div className="relative">
            <UserTaskCard
              user={userData}
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

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            )}
          </div>

          {/* Popups */}
          {togglePopForm && (
            <PopUpForm
              onClose={() => setTogglePopForm(false)}
              onSubmit={handleSubmit}
            />
          )}

          {editProfile && (
            <ProfileEditModal
              user={auth?.user}
              onClose={() => setEditProfile(false)}
              onUpdate={handleProfileSubmit}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}
