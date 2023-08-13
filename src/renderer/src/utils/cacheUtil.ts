import { StoreTypeEnum } from '../../../common/enums/StoreTypeEnum'

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
