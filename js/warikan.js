"use strict"
import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"
import { isNumber, isNaturalNumber, uuid } from "./utils.js"

const FORM_ID       = "warikan_form"
const ACTION_BTN_ID = "action_btn"
const TEMPLATE_ID   = "form_tmpl_input"
const RESULT_ID     = "warikan_result"

const formItems = {
  totalFee: {
    id: "total_fee",
    type: "number",
    label: "支払総額",
    default: 75000,
  },
  donation: {
    id: "donation",
    type: "number",
    label: "カンパ",
    default: 10000,
  },
  roundUnit: {
    id: "round_unit",
    type: "number",
    label: "丸め単位",
    default: 500,
  },
  numPeople: {
    id: "num_people",
    type: "number",
    label: "人数",
    default: 12,
  },
  roundType: {
    id: "round_type",
    type: "radio",
    label: "端数処理",
    default: 0, // the number of options
    options: [
      {
        label: "先輩ありがとう",
        value: WARIKAN_ROUND_TYPE_ENUM.PAY_A_LOT_THNKS,
        insertType: "beforeend", // for insertAdjacentHTML. set the label position for input.
      },
      {
        label: "幹事ありがとう",
        value: WARIKAN_ROUND_TYPE_ENUM.ORGANIZER_THNKS,
        insertType: "beforeend",
      },
    ]
  },
  otherPeopleName: {
    id: "other_people_names",
    type: "text",
    label: "先輩の名前",
    default: 0,
    options: [{ label: "",  value: "", insertType: "afterbegin" }]
  }
}

export default class Warikan {
  formItems = formItems

  createForm() {
    const form      = document.getElementById(FORM_ID)
    const actionBtn = document.getElementById(ACTION_BTN_ID)

    for(const k in this.formItems) {
      const itemElem = this.formItemToElem(
        this.formItems[k].type,
        this.formItems[k].default,
        this.formItems[k].id,
        this.formItems[k].options
      )
      if(!itemElem) return new Error()

      const inputElem = this.cloneNodeById(TEMPLATE_ID)
      const container = inputElem.querySelector(".input_container")
      container.id        = this.formItems[k].id,
      container.innerHTML = `${this.formItems[k].label}:<br>`
      container.appendChild(itemElem)

      form.insertBefore(inputElem, actionBtn)
    }
  }

  formItemToElem(type, value, id, options) {
    return type === "number"
      ? this.createInputElem(type, value)
      : this.createMultiInputsElem(type, value, id, options)
  }

  cloneNodeById(htmlId) {
    const element = document.getElementById(htmlId)
    return element 
      ? element.content.cloneNode(true)
      : new Error(htmlId)
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
      const name    = id
      const checked = idx === value

      const inputElem = this.createInputElem(type, opt.value, null, name, checked)
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
    for(const property in this.formItems) {
      const id = this.formItems[property].id
      const query = 
        this.formItems[property].type === "number"
          ? "input"
          : "input:checked"
      const inputNode = document.getElementById(id)
      const inputElem = inputNode.querySelector(query)
      data[property] = inputElem ? inputElem.value : null
    }
    return data
  }

  validateAndParseData(data) {
    let isValid      = false
    const parsedData = {}
    const error      = []

    const isEnoughArgs = () => formItems.length === data.length
    if(!isEnoughArgs()) {
      error.push({id: null, msg: "internal error"})
      return isValid, parsedData, error
    }

    for(const k in data) {
      const parsedNum  = Number.parseInt(data[k])
      parsedData[k] = parsedNum

      const isValidVal = 
        k === "donation"
          ? isNaturalNumber(parsedNum)
          : isNumber(parsedNum)
      if(!isValidVal) error.push({id: this.formItems[k].id, msg: "input error"})
    }
    isValid = error.length === 0

    return { isValid, parsedData, error }
  }

  /**
   *  data:
   *  must be validated and parsed
   *  must has the same properties as formItems
   */
   calcAndDisplayResult(data) {
    const remaingFee = data.totalFee - data.donation
    const normalFee  = this.calcNormalFee(
      remaingFee,
      data.numPeople,
      data.roundUnit,
      data.roundType
    )
    const otherFee = this.calcOtherFee(
      remaingFee,
      normalFee,
      data.numPeople
    )
    const otherName = this.getOtherName(data.roundType)

    this.displayResult(
      data.totalFee,
      data.donation,
      data.numPeople,
      normalFee,
      otherFee,
      otherName
    ) 
  }

  calcNormalFee(remaingFee, numPeople, roundUnit, roundType) {
    switch(roundType) {
      case WARIKAN_ROUND_TYPE_ENUM.PAY_A_LOT_THNKS:
        return Math.floor(remaingFee / numPeople / roundUnit) * roundUnit
      case WARIKAN_ROUND_TYPE_ENUM.ORGANIZER_THNKS:
        return Math.ceil(remaingFee / numPeople / roundUnit) * roundUnit
      default:
        return Math.floor(remaingFee / numPeople / roundUnit) * roundUnit
    }
  }

  calcOtherFee(remaingFee, normalFee, numPeople) {
    return remaingFee - normalFee * (numPeople - 1)
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

  displayResult(
    totalFee,
    donation,
    numPeople,
    normalFee,
    otherFee,
    otherName
  ) {
    const container = document.getElementById(RESULT_ID)
    container.innerHTML = `
    <table>
      <tr>
        <th>支払い総額</th>
        <th>人数</th>
        <th>支払い額【円】</th>
      <tr>
      <tr>
        <th>一般</th>
        <td>${numPeople - 1}</td>
        <td>${normalFee}</td>
      <tr>
      <tr>
        <th>${otherName}</th>
        <td>${1}</td>
        <td>${otherFee}</td>
      <tr>
      <tr>
        <th>カンパ</th>
        <td></td>
        <td>${donation}</td>
      <tr>
      <tr>
        <th>合計</th>
        <td>${numPeople}</td>
        <td>${totalFee}</td>
      <tr>
    </table>
    `
  }

  showError(args) {
    window.alert(args)
  }
}