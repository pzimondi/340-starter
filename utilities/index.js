/*const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
/* Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
/*Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
/*Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util*/

const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Navigation builder
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += "<li>"
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`
    list += "</li>"
  })

  list += "</ul>"
  return list
}

/* **************************************
 * Build classification grid HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = ""
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid += `
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Thumbnail image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
      `
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid += `
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          ${vehicle.inv_make} ${vehicle.inv_model}
        </a>
      `
      grid += "</h2>"
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build vehicle detail HTML (Task 1)
 * ************************************ */
Util.buildInventoryDetail = async function (vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price)

  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

  return `
    <section class="vehicle-detail" aria-label="Vehicle detail">
      <div class="vehicle-media">
        <img
          class="vehicle-image"
          src="${vehicle.inv_image}"
          alt="Full-size image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"
        />
      </div>

      <div class="vehicle-panel">
        <p class="vehicle-badge">
          <span class="vehicle-year">${vehicle.inv_year}</span>
          <span aria-hidden="true"> • </span>
          <span class="vehicle-make">${vehicle.inv_make}</span>
          <span aria-hidden="true"> • </span>
          <span class="vehicle-model">${vehicle.inv_model}</span>
        </p>

        <p class="vehicle-price">
          <span class="label">No-Haggle Price</span>
          <strong class="price">${price}</strong>
        </p>

        <dl class="vehicle-specs" aria-label="Vehicle specifications">
          <div class="spec-row">
            <dt>Mileage</dt>
            <dd>${miles} miles</dd>
          </div>
          <div class="spec-row">
            <dt>Color</dt>
            <dd>${vehicle.inv_color}</dd>
          </div>
        </dl>

        <div class="vehicle-desc">
          <h2 class="section-heading">Description</h2>
          <p>${vehicle.inv_description}</p>
        </div>

        <p class="supporting">
          Interested in this vehicle? Contact us to schedule a viewing or ask questions.
        </p>
      </div>
    </section>
  `
}

/* ****************************************
 * Error-handling wrapper middleware (Task 2)
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
