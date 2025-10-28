import { FaUser, FaGripVertical, FaTrash } from "react-icons/fa";
import { BsInboxFill } from "react-icons/bs";
import type { Task, UserWithTaskCount } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useState } from "react";

interface UserTaskCardProps {
  user: UserWithTaskCount;
  setSelectedUser?: (user: UserWithTaskCount) => void;
  editingId: string | null;
  editValue: string;
  setEditingId: (id: string | null) => void;
  setEditValue: (val: string) => void;
  handleTitleEdit: (taskId: string | null, userId: string, task: Task) => void;
  handleStatusToggle: (
    taskId: string | null,
    userId: string,
    currentStatus: "completed" | "pending"
  ) => void;
  handleDelete: (taskId: string | null, userId: string) => void;
  handleDragStart: (index: number) => void;
  handleDrop: (index: number, userId: string) => void;
}

export default function UserTaskCard({
  user,
  setSelectedUser,
  editingId,
  editValue,
  setEditingId,
  setEditValue,
  handleTitleEdit,
  handleStatusToggle,
  handleDelete,
  handleDragStart,
  handleDrop,
}: UserTaskCardProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    taskId: string | null;
  }>({ open: false, taskId: null });

  const filteredTasks =
    user.tasks?.filter((task) => {
      if (filterStatus === "completed") return task.status === "completed";
      if (filterStatus === "pending") return task.status !== "completed";
      return true;
    }) || [];

  return (
    <div
      key={user._id}
      className="bg-white rounded-lg shadow-md p-5 w-full mx-auto mt-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex flex-col">
          <div className="text-2xl font-[700] text-gray-600 flex items-center gap-2 capitalize">
            <FaUser className="inline w-6 h-6 text-gray-400 mr-2" />
            {user.fname} {user.lname}
          </div>

          <p className="w-full h-0.5 my-1 bg-gray-200 rounded"></p>

          <div className="flex items-center mt-2 gap-2">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
              {user.department}
            </span>
            <span className="bg-yellow-400 text-white px-2 py-0.5 rounded text-xs font-semibold">
              {user.completionPercentage}% Complete ({user.completedTasks}/
              {user.totalTasks})
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "completed" | "pending")
            }
            className="border cursor-pointer border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          {auth.user?.role === "admin" && (
            <button
              onClick={() => setSelectedUser?.(user)}
              className="bg-purple-600 text-white px-4 py-2 cursor-pointer rounded font-medium shadow hover:bg-purple-700 transition"
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task, index) => (
          <div
            key={task._id}
            className={`flex items-center rounded px-4 py-2 mb-2 ${task.status === "completed" ? "bg-green-100" : "bg-gray-100"
              }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index, user._id)}
          >
            <FaGripVertical className="text-gray-400 mr-3 cursor-grab" />
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() =>
                handleStatusToggle(task._id ?? "", user._id, task.status)
              }
              className={`mr-3 w-4 h-4 ${task.status === "completed"
                ? "accent-green-500"
                : "accent-gray-500"
                }`}
            />

            {editingId === task._id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleTitleEdit(task._id ?? "", user._id, task)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTitleEdit(task._id ?? "", user._id, task);
                  }
                }}
                className="flex-1 border rounded-md p-1 border-gray-400 bg-transparent outline-none text-gray-700"
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditingId(task._id || null);
                  setEditValue(task.title);
                }}
                title="Edit Title"
                className={`flex-1 cursor-text ${task.status === "completed"
                  ? "line-through text-gray-500"
                  : "text-gray-700"
                  }`}
              >
                {task.title || "Unnamed Task"}
              </span>
            )}

            <button
              className="ml-2"
              onClick={() =>
                setConfirmDelete({ open: true, taskId: task._id ?? "" })
              }
            >
              <FaTrash className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition" />
            </button>
          </div>
        ))
      ) : (
        <div className="text-gray-400 italic text-sm w-full h-24 flex flex-col justify-center items-center gap-1 capitalize">
          <BsInboxFill className="text-gray-400 text-3xl" />
          No tasks assigned yet
        </div>
      )}


      {confirmDelete.open && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl border border-gray-200 rounded-lg p-4 w-72 animate-slide-up z-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Are you sure you want to delete this task?
          </h3>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                handleDelete(confirmDelete.taskId, user._id);
                setConfirmDelete({ open: false, taskId: null });
              }}
              className="bg-red-600 text-white px-3 py-1.5 text-sm rounded hover:bg-red-700 transition"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete({ open: false, taskId: null })}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 text-sm rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
