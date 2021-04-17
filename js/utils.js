export const snakeToCamel = (str) => {
  const replaced = str.replace(/_(\w)/g, match => {
    return match.charAt(1).toUpperCase()
  })
  return replaced
}