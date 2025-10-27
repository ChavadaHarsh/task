import { FaUser, FaGripVertical, FaTrash } from "react-icons/fa";
import { BsInboxFill } from "react-icons/bs";
import type { Task, UserWithTaskCount } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface UserTaskCardProps {
  user: UserWithTaskCount;
  setSelectedUser?: (user: UserWithTaskCount) => void;
  editingId: string | null;
  editValue: string;
  setEditingId: (id: string | null) => void;
  setEditValue: (val: string) => void;
  handleTitleEdit: (taskId: string | null, userId: string, task: Task) => void;
  handleStatusToggle: (taskId: string | null, userId: string, currentStatus: "completed" | "pending") => void;
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

  return (
    <div key={user._id} className="bg-white rounded-lg shadow-md p-5 w-full mx-auto mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
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
              {user.completionPercentage}% Complete ({user.completedTasks}/{user.totalTasks})
            </span>
          </div>
        </div>
        {auth.user?.role === "admin" && (<button
          onClick={() => setSelectedUser?.(user)}
          className="bg-purple-600 text-white px-4 py-2 cursor-pointer rounded font-medium shadow hover:bg-purple-700 transition"
        >
          + Add Task
        </button>)}

      </div>

      {/* Task List */}
      {user.tasks && user.tasks.length > 0 ? (
        user.tasks.map((task, index) => (
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
              onChange={() => handleStatusToggle(task._id ?? "", user._id, task.status)}
              className={`mr-3 w-4 h-4 ${task.status === "completed" ? "accent-green-500" : "accent-gray-500"
                }`}
            />

            {/* Edit Mode */}
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

            <button className="ml-2" onClick={() => handleDelete(task._id ?? "", user._id)}>
              <FaTrash className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition" />
            </button>
          </div>
        ))
      ) : (
        <div className="text-gray-400 italic text-sm w-full h-24 flex flex-col justify-center items-center gap-1 capitalize">
          <BsInboxFill className="text-gray-400 text-3xl" />
          No Tasks assigned yet
        </div>
      )}
    </div>
  );
}
