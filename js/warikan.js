"use strict"
import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"

const FORM_ID       = "warikan_form"
const ACTION_BTN_ID = "action_btn"
const TEMPLATE_ID   = "form_tmpl_input"

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
    const form      = document.getElementById(FORM_ID)
    const actionBtn = document.getElementById(ACTION_BTN_ID)

    for(const k in this.formItems) {
      const itemNode = this.formItemToNode(
        this.formItems[k].id,
        this.formItems[k].type,
        this.formItems[k].value,
        this.formItems[k].options
      )
      if(!itemNode) return new Error()

      const inputNode = this.cloneNodeById(TEMPLATE_ID)
      const container = inputNode.querySelector(".input_container")
      container.innerHTML = `${this.formItems[k].label}:<br>`
      container.appendChild(itemNode)

      form.insertBefore(inputNode, actionBtn)
    }
  }

  formItemToNode(id, type, value, options) {
    let itemNode = null
    if (type === "number") {
      itemNode = this.createInputNode(id, type, value)
    }
    if (type === "radio") {
      const fragment = document.createDocumentFragment();
      options.forEach(option => {
        const node = this.createInputNodeWithLabel(null, type, value, option.label, id)
        fragment.appendChild(node)
      })
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