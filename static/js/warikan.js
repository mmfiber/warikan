"use strict"
import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"
import { formItems } from "./formItems.js"
import {
  isNumber,
  isNaturalNumber,
  uuid,
  cloneNodeById,
} from "./utils.js"

const FORM_ID       = "warikan_form"
const ACTION_BTN_ID = "action_btn"
const TEMPLATE_ID   = "form_tmpl_input"
const RESULT_ID     = "warikan_result"

export default class Warikan {
  createForm() {
    const form      = document.getElementById(FORM_ID)
    const actionBtn = document.getElementById(ACTION_BTN_ID)

    for(const k in formItems) {
      const itemElem = this.formItemToElem(
        formItems[k].type,
        formItems[k].default,
        formItems[k].id,
        formItems[k].options
      )
      if(!itemElem) return new Error()

      const inputElem = cloneNodeById(TEMPLATE_ID)
      const container = inputElem.querySelector(".input_container")
      container.id        = formItems[k].id,
      container.innerHTML = `${formItems[k].label}:<br>`
      container.appendChild(itemElem)

      form.insertBefore(inputElem, actionBtn)
    }
  }

  formItemToElem(type, value, id, options) {
    return type === "number"
      ? this.createInputElem(type, value)
      : this.createMultiInputsElem(type, value, id, options)
  }

  createInputElem(type, value, id=null, name=null, checked=null) {
    const inputElem = document.createElement("input")
    if(type)
      inputElem.type = type
    if(value)
      inputElem.value = value
    if(id)
      inputElem.id = id
    if(name)
      inputElem.name = name
    if(checked)
      inputElem.checked = checked
    return inputElem
  }

  createMultiInputsElem(type, value, id, options) {
    const fragment = document.createDocumentFragment();
    options.forEach((opt, idx) => {
      let inputElem = null
      if (type === "radio") {
        const name = id
        const checked = idx === value
        inputElem = this.createInputElem(type, opt.value, null, name, checked)
      } else {
        inputElem = this.createInputElem(type, opt.value)
      }

      const labelElem = document.createElement("label")
      labelElem.appendChild(inputElem)
      labelElem.insertAdjacentHTML(opt.insertType, opt.label)

      fragment.appendChild(labelElem)

      if (type === "text") {
        const insertInputBtn = document.createElement("button")
        insertInputBtn.id = "other_people_name_add"
        insertInputBtn.innerHTML = "追加"
        insertInputBtn.addEventListener("click", this.insertNameInput)
        fragment.appendChild(insertInputBtn)
      }
    })
    fragment.id = id
    return fragment
  }

  insertNameInput() {
    const item = formItems.otherPeopleName

    const idPrefix = "other_people_name_"
    const id       = idPrefix  + uuid()

    const parentElem = document.getElementById(item.id)
    const deleteBtn  = document.createElement("button")
    deleteBtn.innerHTML = "削除"
    deleteBtn.onclick = () => {
      // can refer id and parentscope
      const element = document.getElementById(id)
      parentElem.removeChild(element)
    }

    const addBtnElem = document.getElementById(idPrefix + "add")
    const inputElem  = document.createElement("input")
    const container  = document.createElement("div")
    container.id = id
    container.appendChild(inputElem)
    container.appendChild(deleteBtn)
    parentElem.insertBefore(container, addBtnElem)
  }

  fetchData() {
    const data = {}
    for(const property in formItems) {
      const id = formItems[property].id
      const query = 
        formItems[property].type === "radio"
          ? "input:checked"
          : "input"
      const inputNode = document.getElementById(id)

      if(formItems[property].type === "text") {
        const inputElems = inputNode.querySelectorAll(query)
        data[property] = inputElems ? Array.from(inputElems).map(e => e.value) : null
      } else {
        const inputElem = inputNode.querySelector(query)
        data[property] = inputElem ? inputElem.value : null
      }
    }
    return data
  }

  validateAndParseData(data) {
    let isValid      = false
    const parsedData = {}
    const error      = []

    // validate args
    const isEnoughArgs = () => {
      const formItemsKeys = Object.keys(formItems)
      return Object.keys(data).every(key => formItemsKeys.includes(key))
    }
    if(!isEnoughArgs()) {
      error.push({id: null, msg: "internal error"})
      return isValid, parsedData, error
    }

    // validate form items
    for(const k in data) {
      const parsed  =
        k === "otherPeopleName"
          ? data[k]
          : Number.parseInt(data[k])
      parsedData[k] = parsed

      const isValidVal = this.validateByProperty(parsed, k)
      if(!isValidVal) error.push({id: formItems[k].id, msg: "input error"})
    }
    isValid = error.length === 0

    return { isValid, parsedData, error }
  }

  validateByProperty(value, property) {
    switch(property) {
      case "donation":
        return isNaturalNumber(value)
      case "otherPeopleName":
        return value.length > 0
      default:
        return isNumber(value)
    }
  }

   calc(parsedData) {
    const { totalFee, donation, roundUnit, numPeople, roundType, otherPeopleName } = parsedData

    const remaingFee     = totalFee - donation
    const numOtherPeople = otherPeopleName.length
    const normalFee = this.calcNormalFee(
      remaingFee,
      numPeople,
      roundUnit,
      roundType
    )
    const otherFeesInfo = this.calcOtherFee(
      remaingFee,
      normalFee,
      numPeople,
      numOtherPeople,
      roundUnit
    )
    otherFeesInfo.otherName = this.getOtherName(roundType)
    return { totalFee, donation, numPeople, normalFee, ...otherFeesInfo }
  }

  calcNormalFee(remaingFee, numPeople, roundUnit, roundType=null) {
    switch(roundType) {
      case WARIKAN_ROUND_TYPE_ENUM.PAY_A_LOT_THNKS:
        return Math.floor(remaingFee / numPeople / roundUnit) * roundUnit
      case WARIKAN_ROUND_TYPE_ENUM.ORGANIZER_THNKS:
        return Math.ceil(remaingFee / numPeople / roundUnit) * roundUnit
      default:
        return Math.floor(remaingFee / numPeople / roundUnit) * roundUnit
    }
  }

  calcOtherFee(remaingFee, normalFee, numPeople, numOtherPeople, roundUnit) {
    const otherRemaingFee = remaingFee - normalFee * (numPeople - numOtherPeople)
    const otherNormalFee  = this.calcNormalFee(otherRemaingFee, numOtherPeople, roundUnit)

    let count    = 0
    let fraction = otherRemaingFee - otherNormalFee * numOtherPeople
    while(fraction >= roundUnit) {
      fraction -= roundUnit
      count++
    }
    const otherOtherFee = otherNormalFee + roundUnit

    let otherFractionFee = null
    let numOtherFraction = 0
    if (fraction !== 0) {
      otherFractionFee = otherNormalFee + fraction
      numOtherFraction = 1
    }

    const numOtherOther  = count
    const numOtherNormal = numOtherPeople - numOtherOther - numOtherFraction

    return {
      otherNormalFee,
      otherOtherFee,
      otherFractionFee,
      numOtherNormal,
      numOtherOther,
      numOtherFraction,
    }
  }

  getOtherName(roundType) {
    switch(roundType) {
      case WARIKAN_ROUND_TYPE_ENUM.PAY_A_LOT_THNKS:
        return "先輩"
      case WARIKAN_ROUND_TYPE_ENUM.ORGANIZER_THNKS:
        return "幹事"
      default:
        return "だれかさん"
    }
  }

  displayResult(results) {
    const {
      totalFee,
      donation,
      numPeople,
      normalFee,
      otherNormalFee,
      otherOtherFee,
      otherFractionFee,
      otherName,
      numOtherNormal,
      numOtherOther,
      numOtherFraction
    } = results
    const numNormalPeople = numPeople - (numOtherNormal + numOtherOther + numOtherFraction)
    const container = document.getElementById(RESULT_ID)
    container.innerHTML = `
    <table>
      <tbody>
        <tr>
          <th>支払い総額</th>
          <th>人数</th>
          <th>支払い額【円】</th>
        </tr>
        <tr>
          <th>一般</th>
          <td>${numNormalPeople}</td>
          <td>${normalFee}</td>
        </tr>
        <tr>
          <th>${otherName}</th>
          <td>${numOtherNormal}</td>
          <td>${otherNormalFee}</td>
        </tr>
        <tr style="display: ${numOtherFraction === 0 ? 'none' : 'table-row'}">
          <th>${otherName}</th>
          <td>${numOtherFraction}</td>
          <td>${otherFractionFee}</td>
        </tr>
        <tr style="display: ${numOtherOther === 0 ? 'none' : 'table-row'}">
          <th>${otherName}</th>
          <td>${numOtherOther}</td>
          <td>${otherOtherFee}</td>
        </tr>
        <tr>
          <th>カンパ</th>
          <td></td>
          <td>${donation}</td>
        </tr>
        <tr>
          <th>合計</th>
          <td>${numPeople}</td>
          <td>${totalFee}</td>
        </tr>
      </tbody>
    </table>
    `
  }

  showError(args) {
    window.alert(args)
  }
}