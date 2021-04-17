export const snakeToCamel = (str) => {
  const replaced = str.replace(/_(\w)/g, match => {
    return match.charAt(1).toUpperCase()
  })
  return replaced
}

export const isNumber = (num) => {
  const int = Number.parseInt(num)
  return !isNaN(int)
}

export const isNaturalNumber = (num) => {
  const int = Number.parseInt(num)
  return isNumber(num) && int > 0
}

export const uuid = () => {
  let dt = new Date().getTime()
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (dt + Math.random() *16) % 16 | 0
    dt = Math.floor(dt / 16);
    return (c == "x" ? r :(r&0x3|0x8)).toString(16)
  })
  return uuid
}