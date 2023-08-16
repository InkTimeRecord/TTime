/**
 * 检测数据是否空
 *
 * @param date 数据
 * @returns {boolean}
 */
export function isNull(date: string | object | unknown): boolean {
  return date === undefined || date === null || date === ''
}

/**
 * 检测数据是否不为空
 *
 * @param date 数据
 * @returns {boolean}
 */
export function isNotNull(date: string | object | unknown): boolean {
  return !isNull(date)
}

/**
 * 检测是否为正确的URL格式
 *
 * @param url url
 * @returns {boolean}
 */
export function isUrl(url): boolean {
  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url)
}

/**
 * 检测是否不为正确的URL格式
 *
 * @param url url
 * @returns {boolean}
 */
export function isNotUrl(url): boolean {
  return !isUrl(url)
}
