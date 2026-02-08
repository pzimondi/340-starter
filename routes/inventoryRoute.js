const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- Management Routes ---

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to return inventory by classification as JSON (for AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build add-classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to process add-classification post
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process add-inventory post
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

/* ****************************************
 * Deliver edit inventory view
 * *************************************** */
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.buildEditInventory)
)

/* ****************************************
 * Process inventory update
 * *************************************** */
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

// --- Public Display Routes ---

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

module.exports = router
