import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import RegisterForm from "./RegisterForm";

export default function Register() {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center py-[80px] text-white">
      <div className="w-4/5 md:w-1/2 xl:w-1/3 bg-white/90 rounded-md shadow-2xl p-9">
        <h1 className="text-3xl font-bold text-center mb-3 text-[#2b2d42]">
          Create Account
        </h1>
        <RegisterForm />
           <div className="text-center mt-2 text-gray-700">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
      </div>
    </div>
  );
}
