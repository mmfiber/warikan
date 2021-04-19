"use strict"

import Warikan from "./warikan.js"

const warikan = new Warikan()
const warikanForm     = document.getElementById("warikan_form")
const calcWarikanBtn  = document.getElementById("calc_warikan_btn")
const clearWarikanBtn = document.getElementById("clear_warikan_btn")

function onSubmitWarikanForm(event) {
  // to avoid reflesh browser
  event.preventDefault()
}

function onClickCalcWarikan() {
  const data = warikan.fetchData()

  const {
    isValid,
    parsedData,
    error 
  } = warikan.validateAndParseData(data)
  if(!isValid) return warikan.showError(error)

  const results = warikan.calc(parsedData)
  warikan.displayResult(results)
}

function main() {
  warikan.createForm()
  warikanForm.addEventListener("submit", onSubmitWarikanForm)
  calcWarikanBtn.addEventListener("click", onClickCalcWarikan)
}

main()