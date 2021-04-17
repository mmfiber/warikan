"use strict"

import Warikan from "./warikan.js"

const warikan = new Warikan()
const warikanForm = document.getElementById("warikan_form")

function onSubmitWarikanForm(event) {
  // to avoid reflesh browser
  event.preventDefault()
  const {
    totalAmount,
    donation,
    roundUnit,
    numPeople,
    roundType,
  } = warikan.fetchData()
  console.log({
    totalAmount,
    donation,
    roundUnit,
    numPeople,
    roundType,
  })
}

function main() {
  warikan.createForm()
  warikanForm.addEventListener("submit", onSubmitWarikanForm)
}

main()