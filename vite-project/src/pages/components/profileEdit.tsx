import { useFormik } from "formik";
import * as Yup from "yup";
import type { ProfileEditModalProps } from "../types";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";



const ProfileEditModal = ({ user, onClose, onUpdate }: ProfileEditModalProps) => {
    const auth = useSelector((state: RootState) => state.auth);

    const formik = useFormik({
        initialValues: {
            id:user?.id || "",
            fname: user?.fname || "",
            lname: user?.lname || "",
            email: user?.email || "",
            department: user?.department || "",
        },
        validationSchema: Yup.object({
            fname: Yup.string().min(2, "Too short").required("Required"),
            lname: Yup.string().min(2, "Too short").required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
            department: Yup.string(),
        }),
        onSubmit: (values) => {
            onUpdate(values);
            if (onClose) onClose(); // call onClose if provided
        },
    });

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fname"
                        placeholder="First Name"
                        value={formik.values.fname}
                        onChange={formik.handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {formik.touched.fname && formik.errors.fname && (
                        <p className="text-red-500 text-sm">{formik.errors.fname}</p>
                    )}

                    <input
                        type="text"
                        name="lname"
                        placeholder="Last Name"
                        value={formik.values.lname}
                        onChange={formik.handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {formik.touched.lname && formik.errors.lname && (
                        <p className="text-red-500 text-sm">{formik.errors.lname}</p>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                    {auth.user?.role === "admin" ? (

                        <select
                            id="department"
                            name="department"
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full border p-2 rounded"
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="Android Development">Android Development</option>
                            <option value="iOS Development">iOS Development</option>
                            <option value="Designing">Designing</option>
                        </select>
 
                    ):(

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        readOnly
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        className="w-full border p-2 rounded"
                    />)}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
