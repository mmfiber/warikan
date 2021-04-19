import { WARIKAN_ROUND_TYPE_ENUM } from "./enum.js"

export const formItems = {
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
    id: "other_people_name",
    type: "text",
    label: "先輩や幹事の名前",
    default: 0,
    options: [{ label: "",  value: "名前", insertType: "afterbegin" }]
  }
}