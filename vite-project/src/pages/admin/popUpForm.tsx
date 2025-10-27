import { useEffect, useRef, useState } from "react";
import { MdOutlineCancel, MdSave } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { PopUpFormProps, Task } from "../types";

export default function PopUpForm({ user, onClose, onSubmit }: PopUpFormProps) {
  const [loading, setLoading] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);



  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
  });

  const formik = useFormik<Task>({
    initialValues: {
      title: "",
      createDepartment: user?.department ?? "",
      userId: user?._id || "",
      createRole: user?.role || "employee",
      status: "pending",
      adminId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        onSubmit(values);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-800 transition duration-300 cursor-pointer"
        >
          <MdOutlineCancel size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Task for {user?.fname}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              ref={titleInputRef}

              type="text"
              name="title"

              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border ${formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-gray-300"
                } rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none`}
              placeholder="Enter task title"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdSave size={20} />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
