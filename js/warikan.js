"use strict"
import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"

const FORM_ID     = "warikan_form"
const TEMPLATE_ID_INPUT = "form_tmpl_input"
const TEMPLATE_ID_ACTION_BTN = "form_tmpl_action_btn"

export default class Warikan {
  formItems = {
    totalAmount: {
      id: "total_amount",
      type: "number",
      label: "総額",
      value: 0
    },
    donation: {
      id: "donation",
      type: "number",
      label: "カンパ",
      value: 0
    },
    roundUnit: {
      id: "roundUnit",
      type: "number",
      label: "丸め込み単位",
      value: 0
    },
    numPeople: {
      id: "num_people",
      type: "number",
      label: "人数",
      value: 0
    },
    roundType: {
      id: "round_type",
      type: "radio",
      label: "端数処理",
      value: 0,
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

  createForm() {
    const form = document.getElementById(FORM_ID)

    for(const k in this.formItems) {
      const item = this.formItems[k]

      let input = null
      if (item.type === "number") {
        input = this.createInputNode(item.id, item.type, item.value)
      }
      if (item.type === "radio") {
        const fragment = document.createDocumentFragment();
        item.options.forEach(o => {
          const node = this.createInputNodeWithLabel(null, item.type, o.value, o.label, item.id)
          fragment.appendChild(node)
        })
        input = fragment
      }

      if(!input) return new Error()

      const inputNode = this.cloneNodeById(TEMPLATE_ID_INPUT)
      const container = inputNode.querySelector(".input_container")
      container.innerHTML = `${item.label}:<br>`
      container.appendChild(input)

      form.appendChild(inputNode)
    }

    const actionBtnNode = this.cloneNodeById(TEMPLATE_ID_ACTION_BTN)
    form.appendChild(actionBtnNode)
  }

  cloneNodeById(htmlId) {
    const element = document.getElementById(htmlId)
    return element 
      ? element.content.cloneNode(true)
      : new Error(htmlId)
  }

  createInputNode(id, type, value, name=null) {
    const inputNode = document.createElement("input")
    if(id)
      inputNode.id = id
    if(type)
      inputNode.type = type
    if(value)
      inputNode.value = value
    if(name)
      inputNode.name = name
    return inputNode
  }

  createInputNodeWithLabel(id, type, value, label, name) {
    const inputNode = this.createInputNode(id, type, value, name)
    const labelNode = document.createElement("label")
    labelNode.appendChild(inputNode)
    labelNode.insertAdjacentHTML("beforeend", label)
    return labelNode
  }

  validate(htmlId, cb) {
    // validate 
    // ge
  }
}