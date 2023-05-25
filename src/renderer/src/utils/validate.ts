/**
 * 检测数据是否空
 * @param date 数据
 * @returns {boolean}
 */
export function isNull(date: string): boolean {
  return date === undefined || date === null || date === ''
}

/**
 * 检测数据是否空
 * @param date 数据
 * @returns {boolean}
 */
export function isNotNull(date: string): boolean {
  return !isNull(date)
}
