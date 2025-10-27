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
  const [editProfile, setEditProfile] = useState(false);

  // Fetch user data from backend
  const fetchUser = async () => {
    if (!auth.token || !auth.user?.id) return;

    try {
      const res = await getUserById(auth.token, auth.user.id);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
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
    }
  };

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

  // Task title edit
  const handleTitleEdit = async (
    taskId: string | null,
    userId: string,
    task: Task
  ) => {
    if (!auth?.token || !userData || !userId) return;

    try {
      const updatedTask: Task = { ...task, title: editValue };
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

    try {
      await statusChangeTask(
        auth.token,
        taskId,
        newStatus,
        role,
        auth.user?.id
      );

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
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete task
  const handleDelete = async (taskId: string | null) => {
    if (!auth?.token || !userData) return;

    try {
      await deleteTask(auth.token, taskId);

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
    } catch (error) {
      console.error("Error while updating profile:", error);
    }
  };

  return (
    <PageLayout>
      <div className="flex  justify-between items-center mt-2 px-5">
        <button onClick={() => setEditProfile(true)}>
          <h1 className="text-2xl font-[700] text-gray-600 flex items-center gap-2 capitalize">
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
    </PageLayout>
  );
}
