import { useNavigate } from "react-router-dom";
import { type RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../api/authApi";
import { sessionRemove } from "../../store/slices/authSlice";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import LogoutConfirm from "../auth/LogoutConfirm";

export default function Navigation() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const handleLogout = async (token: string | null) => {
    try {
      await logoutUser(token);
      dispatch(sessionRemove());
      setConfirmLogout(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Task Manager
        </h1>

        <div className="flex flex-row items-center gap-2 relative">
          <h2 className="text-md text-white font-semibold uppercase">
            {auth.user?.fname}
          </h2>

          {auth.token ? (
            <button
              onClick={() => setConfirmLogout(true)} // 👈 open confirmation popup
              className="flex items-center gap-2 font-medium hover:text-gray-200 cursor-pointer transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 font-medium hover:text-gray-200 cursor-pointer transition-all"
            >
              <FaSignInAlt />
              Login
            </button>
          )}

          {confirmLogout && (
            <LogoutConfirm
              onConfirm={() => handleLogout(auth.token)}
              onCancel={() => setConfirmLogout(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
