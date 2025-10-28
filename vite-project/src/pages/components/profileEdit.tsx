import { useFormik } from "formik";
import * as Yup from "yup";
import type { ProfileEditModalProps } from "../types";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";

export default function ProfileEditModal({
  user,
  onClose,
  onUpdate,
}: ProfileEditModalProps) {
  const auth = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      id: user?.id || "",
      fname: user?.fname || "",
      lname: user?.lname || "",
      email: user?.email || "",
      department: user?.department || "",
      password: user?.password || "",
    },
    validationSchema: Yup.object({
      fname: Yup.string()
        .min(2, "First name too short")
        .required("First name is required"),
      lname: Yup.string()
        .min(2, "Last name too short")
        .required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      department: Yup.string().required("Department is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .optional(), // allow empty for no password change
    }),
    onSubmit: (values) => {
      onUpdate(values);
      if (onClose) onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Edit Profile
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              value={formik.values.fname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border p-2 rounded ${
                formik.touched.fname && formik.errors.fname
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.fname && formik.errors.fname && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.fname}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              value={formik.values.lname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border p-2 rounded ${
                formik.touched.lname && formik.errors.lname
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.lname && formik.errors.lname && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.lname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border p-2 rounded ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Department (Admin Editable) */}
          <div>
            {auth.user?.role === "admin" ? (
              <select
                id="department"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border p-2 rounded ${
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
            ) : (
              <input
                type="text"
                name="department"
                placeholder="Department"
                readOnly
                value={formik.values.department}
                className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
              />
            )}
            {formik.touched.department && formik.errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.department}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="New Password (optional)"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border p-2 rounded ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
