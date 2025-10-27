import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { store } from "./store";
import { sessionRemove } from "./store/slices/authSlice";

// Page imports
import Home from "./pages/home";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/admin/dashboard";
import UsersView from "./pages/admin/usersView";
import Employees from "./pages/admin/employees";
import ForgotPassword from "./pages/auth/forgotPassword";
import Navigation from "./pages/components/navigation";
import AdminNavBar from "./pages/admin/adminNavBar";
import "./App.css";

function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen font-[roboto]">
      <Navigation />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

function AdminDashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavBar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  // ✅ React to cross-tab auth events
  useEffect(() => {
    const handleAuthEvent = (event: StorageEvent) => {
      if (event.key === "auth-event" && event.newValue) {
        const data = JSON.parse(event.newValue);

        if (data.type === "logout" || data.type === "force-logout") {
          store.dispatch(sessionRemove());
          window.location.href = "/login";
        }

        if (data.type === "login") {
          const currentUser = localStorage.getItem("user");
          if (currentUser) {
            const parsed = JSON.parse(currentUser);
            if (parsed.email !== data.user) {
              localStorage.clear();
              alert("Another user logged in. This session was logged out.");
              window.location.href = "/login";
            }
          }
        }
      }
    };

    window.addEventListener("storage", handleAuthEvent);
    return () => window.removeEventListener("storage", handleAuthEvent);
  }, []);

  // ✅ Auto session expiry every 1h
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) return;

      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;
      if (now - parseInt(loginTime) > ONE_HOUR) {
        store.dispatch(sessionRemove());
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    };

    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Route>

        <Route element={<AdminDashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/usersview" element={<UsersView />} />
          <Route path="/dashboard/employees" element={<Employees />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-xl font-bold text-black">Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
