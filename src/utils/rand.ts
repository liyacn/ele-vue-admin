const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numberChars = '0123456789'
const defaultChars = lowerChars + upperChars + numberChars
const defaultLen = 16

export default {
  // 生成随机字符串，可指定长度和字符集
  strings(len = defaultLen, chars = defaultChars): string {
    let res = ''
    for (let i = 0; i < len; i++) {
      const pos = Math.floor(Math.random() * chars.length)
      res += chars[pos]
    }
    return res
  },
  // 小写字母
  lowers(len = defaultLen) {
    return this.strings(len, lowerChars)
  },
  // 大写字母
  uppers(len = defaultLen) {
    return this.strings(len, upperChars)
  },
  // 数字
  numbers(len = defaultLen): string {
    return this.strings(len, numberChars)
  },
  // 指定范围的整数
  bignum(max = Number.MAX_SAFE_INTEGER, min = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
