"use strict"

import Warikan from "./warikan.js"

const warikan = new Warikan()
const warikanForm = document.getElementById("warikan_form")

function onSubmitWarikanForm() {
  // get warikan input
  // validate input
  // calculate warikan
  // output result
}

function main() {
  // create warikan form
  warikan.createForm()
  warikanForm.addEventListener("submit", onSubmitWarikanForm)
}

main()