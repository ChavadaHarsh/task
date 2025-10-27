const Joi = require("joi");

const registerValidation = Joi.object({
  fname: Joi.string().min(2).required(),
  lname: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("employee", "admin").optional(),
  department: Joi.string().valid(
    "Web Development",
    "Android Development",
    "iOS Development",
    "Designing",
    "admin"
  ),

  state: Joi.string().valid("online", "offline").optional(),
});

module.exports = registerValidation;
