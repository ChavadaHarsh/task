import Joi from "joi";

export const taskValidationSchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
  }),

  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),

  createRole: Joi.string().valid("admin", "employee").default("employee"),

  createDepartment: Joi.string().valid(
    "Web Development",
    "Android Development",
    "iOS Development",
    "Designing",
    "admin"
  ),
  status: Joi.string()
    .valid("pending", "completed", "declined")
    .default("pending"),

  statusChangeRole: Joi.string()
    .valid("admin", "employee", "none")
    .default("none"),

  adminId: Joi.string().allow(null).optional(),
});

export const taskStatusChangeValidationSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "completed", "declined")
    .default("pending"),

  statusChangeRole: Joi.string().valid("admin", "employee", "none"),
  adminId: Joi.string().allow(null).optional(),
});
