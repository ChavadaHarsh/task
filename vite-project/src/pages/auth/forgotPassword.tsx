import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { ForgotPasswordValues } from "../types";
import Alert from "../components/alert";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  // Redirect logged-in users
  useEffect(() => {
    if (auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  // ✅ Formik setup
  const formik = useFormik<ForgotPasswordValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setAlert("");
        setMessage("");

        const { confirmPassword, ...payload } = values;
        const response = await forgotPassword(payload);
        setMessage(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 100);

        resetForm();
      } catch (error: any) {
        console.error(error);
        setAlert(error.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen relative flex justify-center items-center text-white py-[80px]">
      <form
        onSubmit={formik.handleSubmit}
        className="w-4/5 md:w-1/2 xl:w-1/3 bg-white/90 flex flex-col gap-3 p-9 rounded-md shadow-2xl text-gray-900"
      >
        <h1 className="text-3xl font-bold text-center mb-3 text-[#2b2d42]">
          Forgot Password
        </h1>

        {/* Email */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="email" className="text-lg font-semibold">
            Email
          </label>
          <div className="relative">
            <MdOutlineEmail className="absolute top-1/2 left-3 -translate-y-1/2 text-2xl text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
              className={`w-full p-2 pl-12 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 transition ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
                }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-lg font-semibold">
            Password
          </label>
          <div className="relative">
            <RiLockPasswordLine className="absolute top-1/2 left-3 -translate-y-1/2 text-2xl text-gray-400" />

            <input

              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              className={`w-full p-2 pl-12 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 transition ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[15px] text-gray-600 text-lg hover:text-gray-800"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-lg font-semibold">
            Password
          </label>
          <div className="relative">
            <RiLockPasswordLine className="absolute top-1/2 left-3 -translate-y-1/2 text-2xl text-gray-400" />

            <input

              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              className={`w-full p-2 pl-12 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 transition ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[15px] text-gray-600 text-lg hover:text-gray-800"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {formik.touched.password && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-1/2 xl:w-1/3 border-2 mt-5 m-auto text-white rounded-md border-blue-600 bg-blue-600 flex items-center justify-center p-2 cursor-pointer hover:border-blue-700 hover:bg-blue-700 active:scale-95 transition-all duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin text-white text-lg mr-2" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>

        {alert && <p className="text-red-500 text-sm text-center">{alert}</p>}

        <div className="text-center mt-2 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline duration-300 transition-all"
          >
            Login
          </Link>
        </div>
      </form>

      {/* ✅ Show success alert when message exists */}
      {message &&
        <Alert message={message} type="success" duration={3000} />}
    </div>
  );
}
