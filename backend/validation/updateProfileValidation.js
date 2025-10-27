const Joi = require("joi");

const updateProfileValidation = Joi.object({
  id:Joi.string(),
  fname: Joi.string().min(2).required(),
  lname: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  department: Joi.string().valid(
    "Web Development",
    "Android Development",
    "iOS Development",
    "Designing",
    "admin"
  ),

});

module.exports = updateProfileValidation;