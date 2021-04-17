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