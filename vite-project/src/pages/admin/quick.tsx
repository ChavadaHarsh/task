import { FaInfoCircle } from "react-icons/fa";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaPalette,
  FaUsers,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function QuickRes() {
  const navigate = useNavigate();

  const navItems = [
    {
      to: "/dashboard/usersview?dept=Web Development",
      label: "Web Development",
      icon: <FaGlobe />,
      color: "blue-600", // web
    },
    {
      to: "/dashboard/usersview?dept=Android Development",
      label: "Android Development",
      icon: <FaAndroid />,
      color: "green-600", // android
    },
    {
      to: "/dashboard/usersview?dept=iOS Development",
      label: "iOS Development",
      icon: <FaApple />,
      color: "black", // ios
    },
    {
      to: "/dashboard/usersview?dept=Designing",
      label: "Designing",
      icon: <FaPalette />,
      color: "blue-500", // design
    },
    {
      to: "/dashboard/employees",
      label: "Employees",
      icon: <FaUsers />,
      color: "gray-700", // generic
    },
  ];

  return (
    <div className="w-full mt-10 pb-4">
      {/* Header */}
      <p className="flex gap-4 items-center text-lg p-2 bg-gray-200 rounded pl-4">
        <FaInfoCircle />
        Quick Action
      </p>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-4">
        {navItems.map((item, index) => {
          const borderColor = `border-${item.color}`;
          const textColor = `text-${item.color}`;
          return (
            <button
              key={index}
              onClick={() => navigate(item.to)}
              className={`min-w-72 cursor-pointer duration-300 flex items-center justify-center gap-2 py-2 border-2 rounded hover:opacity-50 transition ${borderColor} ${textColor}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
