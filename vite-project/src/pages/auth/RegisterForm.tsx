import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { registerApi } from "../../api/authApi";
import type { RegisterValues } from "../types";
interface RegisterFormProps{
    onclose?:()=>void
}

export default function RegisterForm({onclose}:RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState<string>();
  const navigate = useNavigate();

  const formik = useFormik<RegisterValues>({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee",
      department: "",
    },
    validationSchema: Yup.object({
      fname: Yup.string().min(2, "First name too short").required("Required"),
      lname: Yup.string().min(2, "Last name too short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "At least 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const { confirmPassword, ...payload } = values;
        await registerApi(payload);
        resetForm();
        navigate("/login");
      } catch (error: any) {
        setAlert(error.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-3 text-gray-900"
    >
      {/* First Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="fname" className="text-lg font-semibold">
          First Name
        </label>
        <div className="relative">
          <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="fname"
            name="fname"
            type="text"
            value={formik.values.fname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter first name"
            className={`w-full p-2 pl-10 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
              formik.touched.fname && formik.errors.fname
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>
        {formik.touched.fname && formik.errors.fname && (
          <p className="text-red-500 text-sm">{formik.errors.fname}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="lname" className="text-lg font-semibold">
          Last Name
        </label>
        <div className="relative">
          <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="lname"
            name="lname"
            type="text"
            value={formik.values.lname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter last name"
            className={`w-full p-2 pl-10 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
              formik.touched.lname && formik.errors.lname
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>
        {formik.touched.lname && formik.errors.lname && (
          <p className="text-red-500 text-sm">{formik.errors.lname}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-lg font-semibold">
          Email
        </label>
        <div className="relative">
          <MdOutlineEmail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter email"
            className={`w-full p-2 pl-10 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
              formik.touched.email && formik.errors.email
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
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-lg font-semibold">
          Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter password"
            className={`w-full p-2 pl-10 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
              formik.touched.password && formik.errors.password
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
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-lg font-semibold">
          Confirm Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Re-enter password"
            className={`w-full p-2 pl-10 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-[15px] text-gray-600 text-lg hover:text-gray-800"
          >
            {showConfirm ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {formik.errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Department */}
      <div className="flex flex-col gap-2">
        <label htmlFor="department" className="text-lg font-semibold">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formik.values.department}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full p-2 text-lg rounded-xl border-2 focus:outline-none focus:border-blue-600 ${
            formik.touched.department && formik.errors.department
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select Department</option>
          <option value="Web Development">Web Development</option>
          <option value="Android Development">Android Development</option>
          <option value="iOS Development">iOS Development</option>
          <option value="Designing">Designing</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-1/2 xl:w-1/3 border-2 mt-5 m-auto text-white rounded-md border-blue-600 bg-blue-600 flex items-center justify-center p-2 cursor-pointer hover:border-blue-700 hover:bg-blue-700 active:scale-95 transition-all duration-300 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin text-white text-lg mr-2" />
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>

      {alert && <p className="text-red-500 text-sm text-center">{alert}</p>}

   
    </form>
  );
}
