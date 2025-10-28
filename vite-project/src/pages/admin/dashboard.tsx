import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { getParticularDepartmentUserCount } from "../../api/adminApi";
import type { DepartmentUserCount } from "../types";
import PageLayout from "../components/pageLoyout";
import {
  FaAndroid,
  FaApple,
  FaChartLine,
  FaGlobe,
  FaRegEye,
} from "react-icons/fa6";
import { MdColorLens } from "react-icons/md";
import QuickRes from "./quick";
import { FaSpinner } from "react-icons/fa";
export default function Dashboard() {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [userCounts, setUserCounts] = useState<DepartmentUserCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, [auth.token, navigate]);

  // Fetch department user counts
  const fetchUserCounts = useCallback(async () => {
    if (!auth.token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getParticularDepartmentUserCount(auth.token);
      setUserCounts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch department user counts");
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    fetchUserCounts();
  }, [fetchUserCounts]);

  return (
    <PageLayout>
      <div className="w-full  ">
        <div className="flex gap-1 items-center my-2 ">
          <FaChartLine className="text-2xl md:text-3xl xl:text-4xl font-[500]  text-shadow-2xs text-[#2b2d42] " />
          <h1 className=" text-2xl md:text-3xl xl:text-4xl font-[500]  text-shadow-2xs text-[#2b2d42] ">
            Work Tracking Dashboard
          </h1>
        </div>
        {loading && (
          <p className="flex items-center gap-2 text-gray-600">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </p>
        )}{" "}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  cursor-pointer ">
          {userCounts.map((dept) => (
            <div
              key={dept.departmentName}
              className=" shadow-xl rounded-lg p-6 flex flex-col items-center bg-gray-50 justify-center border border-gray-200 hover:scale-105 duration-300 transition-all"
            >
              {dept.departmentName === "Web Development" && (
                <FaGlobe className="text-blue-600 text-5xl" />
              )}
              {dept.departmentName === "Android Development" && (
                <FaAndroid className="text-green-600 text-5xl" />
              )}
              {dept.departmentName === "iOS Development" && (
                <FaApple className="text-black-600 text-5xl" />
              )}
              {dept.departmentName === "Designing" && (
                <MdColorLens className="text-blue-400 text-5xl" />
              )}

              <h2 className="text-2xl font-semibold my-2">
                {dept.departmentName}
              </h2>
              <p className="text-gray-600 text-md flex gap-1 font-[500]">
                <span className="font-bold ">{dept.totalUsers}</span>
                employee
              </p>
              <p className="text-gray-600 text-md flex gap-1 font-[500]">
                <span className="font-bold ">{dept.totalTasks}</span>
                total tasks
              </p>
              <p className="text-gray-600 text-md flex gap-1 font-[500]">
                <span className="font-bold ">{dept.totalCompleted}</span>
                completed tasks
              </p>
              <p
                className={`text-md flex gap-1 py-1 px-1.5 rounded-xl font-[500] items-center ${
                  dept.completedPercent === 0
                    ? "bg-red-500 text-white"
                    : dept.completedPercent < 25
                    ? "bg-blue-500"
                    : dept.completedPercent < 50
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              >
                <span className="font-bold">{dept.completedPercent}%</span>{" "}
                complete
              </p>

              <button
                className={`px-1.5 text-md mt-4 text-white font-semibold  hover:bg-[#333] rounded-md py-1 cursor-pointer
                  ${
                    dept.departmentName === "Web Development"
                      ? "bg-blue-600"
                      : dept.departmentName === "Android Development"
                      ? "bg-green-600"
                      : dept.departmentName === "iOS Development"
                      ? "bg-black"
                      : "bg-blue-500"
                  }`}
                onClick={() =>
                  navigate(`/dashboard/usersview?dept=${dept.departmentName}`)
                }
              >
                <span className="flex gap-1 items-center">
                  <FaRegEye className="text-lg text-white" /> View Details{" "}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <QuickRes />
    </PageLayout>
  );
}
