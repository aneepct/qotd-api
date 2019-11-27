const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddCategory(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";


  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
