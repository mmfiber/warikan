"use strict"

import Warikan from "./warikan.js"

const warikan = new Warikan()
const warikanForm = document.getElementById("warikan_form")

function onSubmitWarikanForm(event) {
  // to avoid reflesh browser
  event.preventDefault()

  const data = warikan.fetchData()

  const {isValid, parsedData, error } = warikan.validateAndParseData(data)
  if(!isValid) return warikan.showError(error)

  warikan.calcAndDisplayResult(parsedData)
}

function main() {
  warikan.createForm()
  warikanForm.addEventListener("submit", onSubmitWarikanForm)
}

main()