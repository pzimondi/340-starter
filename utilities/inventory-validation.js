const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name."),
  ]
}

/* **********************************
 * Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please select a classification."),
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
    body("inv_year").isNumeric().isLength({ min: 4, max: 4 }).withMessage("Provide a 4-digit year."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").isNumeric().withMessage("Price must be a number."),
    body("inv_miles").isNumeric().withMessage("Miles must be a number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ]
}

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}

module.exports = validate