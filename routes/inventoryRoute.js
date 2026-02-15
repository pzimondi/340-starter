const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- Protected Management Routes ---

/* ****************************************
 * Build inventory management view
 * *************************************** */
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildManagement)
)

/* ****************************************
 * Return inventory by classification as JSON (AJAX)
 * *************************************** */
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ****************************************
 * Build add-classification view
 * *************************************** */
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildAddClassification)
)

/* ****************************************
 * Process add-classification
 * *************************************** */
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-inventory view
 * *************************************** */
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildAddInventory)
)

/* ****************************************
 * Process add-inventory
 * *************************************** */
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

/* ****************************************
 * Deliver edit inventory view
 * *************************************** */
router.get(
  "/edit/:invId",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildEditInventory)
)

/* ****************************************
 * Process inventory update
 * *************************************** */
router.post(
  "/update",
  utilities.checkJWTToken,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// --- Public Display Routes ---

/* ****************************************
 * Display inventory by classification
 * *************************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ****************************************
 * Display inventory item detail
 * *************************************** */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

/* ****************************************
 * Display vehicle statistics (Enhancement)
 * *************************************** */
router.get(
  "/statistics",
  utilities.handleErrors(invController.buildStatistics)
)

module.exports = router