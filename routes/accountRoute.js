/**************************
 * Account Routes
 **************************/
const express = require("express")
const router = new express.Router()

// Utilities and controller
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/**************************
 * Deliver Login View
 **************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/**************************
 * Deliver Register View
 **************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/**************************
 * Process Login
 **************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/**************************
 * Process Register
 **************************/
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/**************************
 * Account Management View (Requires Login)
 **************************/
router.get(
  "/",
  utilities.checkJWTToken, // ensure user is logged in
  utilities.handleErrors(accountController.buildAccountManagement)
)

/**************************
 * Account Update View (Requires Login)
 **************************/
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

/**************************
 * Process Account Update
 **************************/
router.post(
  "/update",
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

/**************************
 * Process Password Change
 **************************/
router.post(
  "/update-password",
  utilities.checkJWTToken,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/**************************
 * Logout
 **************************/
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

module.exports = router
