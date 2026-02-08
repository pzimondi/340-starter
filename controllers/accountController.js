/**************************
 * Account Controller
 **************************/
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ****************************************
 *  Deliver login view
 * ************************************ */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Deliver registration view
 * ************************************ */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
}

/* ****************************************
 *  Process registration request
 * ************************************ */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash password
  const hashedPassword = await bcrypt.hash(account_password, 10)

  // Create account (model function must exist)
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", "Congratulations, you are registered! Please log in.")
    return res.status(201).redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
  })
}


/* ****************************************
 *  Exports
 * ************************************ */
module.exports = {
  buildLogin,
  accountLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
}
