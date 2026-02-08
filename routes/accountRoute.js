/**************************
 * Account Routes
 **************************/
const express = require("express")
const router = new express.Router()

// Utilities and controller
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Validation (login + register rules)
const regValidate = require("../utilities/account-validation")

/**************************
 * Deliver Login View
 **************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))


/**************************
 * Process the Login Request
 * (THIS is the route your instructions refer to)
 **************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/**************************
 * (Optional but common in CSE340) Deliver Register View
 **************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/**************************
 * (Optional but common in CSE340) Process Register
 **************************/
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router
