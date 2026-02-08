'use strict'

const form = document.querySelector("#updateForm")

if (form) {
  form.addEventListener("change", function () {
    const updateBtn = form.querySelector("button[type='submit']")
    updateBtn.removeAttribute("disabled")
  })
}
