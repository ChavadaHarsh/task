import { FaExclamationTriangle } from "react-icons/fa";
import type { LogoutConfirmProps } from "../types";

export default function LogoutConfirm({
  onConfirm,
  onCancel,
}: LogoutConfirmProps) {
  return (
    <div className="absolute top-12 right-0 bg-white text-gray-800 shadow-xl border border-gray-200 rounded-lg px-5 py-4 w-64 z-50 animate-fadeIn">
      <div className="flex items-center gap-2 mb-3">
        <FaExclamationTriangle className="text-yellow-500 text-lg" />
        <p className="text-sm font-medium">Are you sure you want to logout?</p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onConfirm}
          className="bg-red-600 cursor-pointer text-white text-sm px-3 py-1.5 rounded hover:bg-red-700 transition"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 cursor-pointer text-gray-700 text-sm px-3 py-1.5 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
