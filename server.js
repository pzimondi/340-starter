const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/

// Home
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory
app.use("/inv", inventoryRoute)

// Static + error trigger route
app.use(staticRoutes)

// 404 handler (must be last route)
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Please try a different route."

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Server
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
