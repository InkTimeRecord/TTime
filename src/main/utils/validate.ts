/**
 * 检测数据是否空
 * @param date 数据
 * @returns {boolean}
 */
function isNull(date): boolean {
  return date === undefined || date === null || date === ''
}

/**
 * 检测数据是否空
 * @param date 数据
 * @returns {boolean}
 */
function isNotNull(date): boolean {
  return !isNull(date)
}

export { isNull, isNotNull }
