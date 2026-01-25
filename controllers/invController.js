/*const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

/* invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont*/

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const nav = await utilities.getNav()
  const grid = await utilities.buildClassificationGrid(data)

  // Prevent crashes when no vehicles exist for a classification
  const className = data[0]?.classification_name || "Vehicles"

  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory detail view by inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const nav = await utilities.getNav()

  const vehicle = await invModel.getInventoryById(inv_id)
  console.log("DETAIL inv_id:", inv_id)
  console.log("DETAIL vehicle:", vehicle)

  // 404 via error view when not found
  if (!vehicle) {
    return next({ status: 404, message: "Sorry, we could not find that vehicle." })
  }

  const vehicleHtml = await utilities.buildInventoryDetail(vehicle)

  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`, // title element uses this via layout
    nav,
    vehicleHtml,
  })
}

module.exports = invCont
