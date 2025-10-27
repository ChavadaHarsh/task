import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/admin/dashboard";
import UsersView from "./pages/admin/usersView";
import Navigation from "./pages/components/navigation";
import AdminNavBar from "./pages/admin/adminNavBar";
import Employees from "./pages/admin/employees";
import ForgotPassword from "./pages/auth/forgotPassword";

// Dashboard layout (includes Navigation)
function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen font-[roboto]">
      <Navigation />
      <main className="flex-1  bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

function AdminDashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavBar />
      <main className="flex-1  bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
export default function App() {
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
