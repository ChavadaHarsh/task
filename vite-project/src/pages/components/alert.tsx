import { useState, useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

const Alert = ({
  message,
  type = "error",
  duration = 3000,
  onClose,
}: AlertProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "info"
      ? "bg-blue-500"
      : "bg-red-500";

  return (
    <div
      className={`fixed  top-15 right-5 ${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3`}
    >
      <span className="flex-1">{message}</span>
      <button
        className="text-white font-bold"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
