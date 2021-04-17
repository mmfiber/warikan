"use strict"
import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"

const FORM_ID       = "warikan_form"
const ACTION_BTN_ID = "action_btn"
const TEMPLATE_ID   = "form_tmpl_input"

const formItems = {
  totalAmount: {
    id: "total_amount",
    type: "number",
    label: "総額",
  },
  donation: {
    id: "donation",
    type: "number",
    label: "カンパ",
  },
  roundUnit: {
    id: "round_unit",
    type: "number",
    label: "丸め込み単位",
  },
  numPeople: {
    id: "num_people",
    type: "number",
    label: "人数",
  },
  roundType: {
    id: "round_type",
    type: "radio",
    label: "端数処理",
    options: [
      {
        label: "先輩ありがとう",
        value: WARIKAN_ROUND_TYPE_ENUM.PAY_A_LOT_THNKS
      },
      {
        label: "幹事ありがとう",
        value: WARIKAN_ROUND_TYPE_ENUM.ORGANIZER_THNKS
      },
    ]
  },
}

export default class Warikan {
  formItems = formItems

  createForm() {
    const form      = document.getElementById(FORM_ID)
    const actionBtn = document.getElementById(ACTION_BTN_ID)

    for(const k in this.formItems) {
      const itemNode = this.formItemToNode(
        this.formItems[k].id,
        this.formItems[k].type,
        this.formItems[k].options
      )
      if(!itemNode) return new Error()

      const inputNode = this.cloneNodeById(TEMPLATE_ID)
      const container = inputNode.querySelector(".input_container")
      container.id = this.formItems[k].id,
      container.innerHTML = `${this.formItems[k].label}:<br>`
      container.appendChild(itemNode)

      form.insertBefore(inputNode, actionBtn)
    }
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
      data[property]  = inputElem ? inputElem.value : null
    }
    return data
  }

  formItemToNode(id, type, options) {
    let itemNode = null
    if (type === "number") {
      itemNode = this.createInputElem(type)
    }
    if (type === "radio") {
      const fragment = document.createDocumentFragment();
      options.forEach(o => {
        const node = this.createInputElemWithLabel(type, null, o.value, o.label, id)
        fragment.appendChild(node)
      })
      fragment.id = id
      itemNode = fragment
    }
    return itemNode
  }

  cloneNodeById(htmlId) {
    const element = document.getElementById(htmlId)
    return element 
      ? element.content.cloneNode(true)
      : new Error(htmlId)
  }

  createInputElem(type, id=null, value=null, name=null) {
    const inputElem = document.createElement("input")
    if(id)
      inputElem.id = id
    if(type)
      inputElem.type = type
    if(value)
      inputElem.value = value
    if(name)
      inputElem.name = name
    return inputElem
  }

  createInputElemWithLabel(type, id, value, label, name) {
    const inputElem = this.createInputElem(type, id, value, name)
    const labelElem = document.createElement("label")
    labelElem.appendChild(inputElem)
    labelElem.insertAdjacentHTML("beforeend", label)
    return labelElem
  }

  validate(htmlId, cb) {
    // validate 
    // ge
  }
}