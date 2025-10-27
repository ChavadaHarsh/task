const Joi = require("joi");

const UserLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = UserLoginValidation;
