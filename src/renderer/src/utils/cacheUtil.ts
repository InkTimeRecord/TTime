import { StoreTypeEnum } from '../../../common/enums/StoreTypeEnum'
import { isNotNull } from '../../../common/utils/validate'

/**
 * 获取
 *
 * @param key key
 * @return any
 */
export const cacheGet = (key): any => {
  return window.api['cacheGet'](StoreTypeEnum.CONFIG, key)
}

/**
 * 设置
 *
 * @param key key
 * @param val val
 * @return any
 */
export const cacheSet = (key, val): any => {
  const type = Object.prototype.toString.call(val)
  if (type === '[object Object]' || type === '[object Array]') {
    val = JSON.parse(JSON.stringify(val))
  }
  window.api['cacheSet'](StoreTypeEnum.CONFIG, key, val)
}

/**
 * 获取
 *
 * @param key key
 */
export const oldCacheGet = (key) => {
  return oldCacheGetByObj(key, true)
}

/**
 * 设置
 *
 * @param key key
 * @param val val
 */
export const oldCacheSet = (key, val) => {
  return oldCacheSetByObj(key, val, true)
}

/**
 * 获取
 *
 * @param key key
 */
export const oldCacheGetStr = (key) => {
  return oldCacheGetByObj(key, false)
}

/**
 * 设置
 *
 * @param key key
 * @param val val
 */
export const oldCacheSetStr = (key, val) => {
  return oldCacheSetByObj(key, val, false)
}

/**
 * 获取
 *
 * @param key key
 * @param isObj 是否为对象
 */
export const oldCacheGetByObj = (key, isObj) => {
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
export const oldCacheSetByObj = (key, val, isObj) => {
  return (localStorage[key] = isNotNull(val) && isObj ? JSON.stringify(val) : val)
}
