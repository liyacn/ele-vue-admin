const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numberChars = '0123456789'
const defaultChars = lowerChars + upperChars + numberChars
const defaultLen = 16

const strings = (len = defaultLen, chars = defaultChars): string => {
  let res = ''
  for (let i = 0; i < len; i++) {
    const pos = Math.floor(Math.random() * chars.length)
    res += chars[pos]
  }
  return res
}

export default {
  strings,
  lowers: (len = defaultLen) => strings(len, lowerChars),
  uppers: (len = defaultLen) => strings(len, upperChars),
  numbers: (len = defaultLen) => strings(len, numberChars),
}
