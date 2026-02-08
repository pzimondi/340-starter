/**************************
 * Account Validation Rules
 **************************/
const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
  ]
}

/* **********************************
 * Check registration data and return errors or continue
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Login Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Please provide a valid password."),
  ]
}

/* **********************************
 * Check login data and return errors or continue
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate
