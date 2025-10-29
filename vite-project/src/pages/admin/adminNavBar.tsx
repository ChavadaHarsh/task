import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaGlobe,
  FaAndroid,
  FaApple,
  FaPalette,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSignInAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { sessionRemove } from "../../store/slices/authSlice";
import type { RootState } from "../../store";
import { logoutUser } from "../../api/authApi";
import LogoutConfirm from "../auth/LogoutConfirm";

export default function AdminNavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    {
      to: "/dashboard/usersview?dept=Web Development",
      label: "Web Development",
      icon: <FaGlobe />,
    },
    {
      to: "/dashboard/usersview?dept=Android Development",
      label: "Android Development",
      icon: <FaAndroid />,
    },
    {
      to: "/dashboard/usersview?dept=iOS Development",
      label: "iOS Development",
      icon: <FaApple />,
    },
    {
      to: "/dashboard/usersview?dept=Designing",
      label: "Designing",
      icon: <FaPalette />,
    },
    { to: "/dashboard/employees", label: "Employees", icon: <FaUsers /> },
  ];

  const handleLogout = async (token: string | null) => {
    try {
      await logoutUser(token);
      dispatch(sessionRemove());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Admin Panel
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 font-medium hover:text-gray-200 transition-all ${
                location.pathname === to
                  ? "text-white font-semibold"
                  : "opacity-90"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}

          {auth.token ? (
            <button
              onClick={() => setConfirmLogout(true)}
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
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* ✅ Logout Confirm Popup */}
        {confirmLogout && (
          <div className="absolute top-2 right-6">
            <LogoutConfirm
              onConfirm={() => handleLogout(auth.token)}
              onCancel={() => setConfirmLogout(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-blue-600 px-6 pb-4 space-y-2 animate-fadeIn">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 font-medium hover:text-gray-200 transition-all ${
                location.pathname === to
                  ? "text-white font-semibold"
                  : "opacity-90"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}

          {auth.token ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="flex items-center gap-2 font-medium cursor-pointer hover:text-gray-200 transition-all w-full"
            >
              <FaSignOutAlt />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 font-medium cursor-pointer hover:text-gray-200 transition-all w-full"
            >
              <FaSignInAlt />
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
