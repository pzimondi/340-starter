const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- Management Routes ---

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

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