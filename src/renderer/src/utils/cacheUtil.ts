import { isNotNull } from '../../../common/utils/validate'

/**
 * 获取
 *
 * @param key key
 */
export const cacheGet = (key) => {
  return cacheGetByObj(key, true)
}

/**
 * 设置
 *
 * @param key key
 * @param val val
 */
export const cacheSet = (key, val) => {
  return cacheSetByObj(key, val, true)
}

/**
 * 获取
 *
 * @param key key
 */
export const cacheGetStr = (key) => {
  return cacheGetByObj(key, false)
}

/**
 * 设置
 *
 * @param key key
 * @param val val
 */
export const cacheSetStr = (key, val) => {
  return cacheSetByObj(key, val, false)
}

/**
 * 获取
 *
 * @param key key
 * @param isObj 是否为对象
 */
export const cacheGetByObj = (key, isObj) => {
  const res = localStorage[key]
  return isNotNull(res) && isObj ? JSON.parse(res) : res
}

/**
 * 设置
 *
 * @param key   key
 * @param val   val
 * @param isObj 是否为对象
 */
export const cacheSetByObj = (key, val, isObj) => {
  return (localStorage[key] = isNotNull(val) && isObj ? JSON.stringify(val) : val)
}
