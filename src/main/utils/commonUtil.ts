/**
 * 尝试把字符串格式的数字转换为数字格式
 *
 * 如果类型为字符串的数字则转换类型为数字
 * 如果类型为其他则不处理
 */
const convertToNumber = (str: any): any => {
  if (typeof str !== 'string') {
    return str
  }
  const number = Number(str)
  return !Number.isNaN(number) ? number : str
}

export default {
  convertToNumber
}
