import { random } from './strUtil'
import { OcrServiceEnum } from '../enums/OcrServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'
import { isNull } from './validate'
import { VolcanoOcrModelEnum } from '../enums/VolcanoOcrModelEnum'

/**
 * 保存Ocr服务list
 *
 * @param ocrServiceMap Ocr服务list
 */
export const setOcrServiceMap = (ocrServiceMap): void => {
  if (ocrServiceMap.size > 0) {
    const ocrServiceOne = ocrServiceMap.entries().next().value[0]
    if (isNull(ocrServiceOne['index'])) {
      let index = 0
      ocrServiceMap.forEach((ocrService) => {
        ocrService['index'] = index
        index++
      })
    }
  }
  cacheSet('ocrServiceMap', Array.from(ocrServiceMap.entries()))
}

/**
 * 获取Ocr服务list
 */
export const getOcrServiceMap = () => {
  let map = new Map(cacheGet('ocrServiceMap'))
  if (map.size > 0) {
    // 因为之前的版本中的数据没有 index 所以这里默认获取第一条翻译源
    // 看是否有设置 index 如果没有默认赋值一遍
    const ocrServiceOne = map.entries().next().value[0]
    if (isNull(ocrServiceOne['index'])) {
      setOcrServiceMap(map)
    }
  }
  map = new Map(cacheGet('ocrServiceMap'))
  // 将 Map 转换为包含键值对数组的二维数组
  const entries = Array.from(map.entries())
  // 对二维数组按照对象的 index 属性进行排序
  entries.sort((a, b) => a[1]['index'] - b[1]['index'])
  // 创建一个新的有序 Map
  map = new Map(entries)
  // 此处重新更新一下logo 防止当在缓存中存储后 如果应用修改了文件路径 会导致读取logo图片失败
  map.forEach((ocrService) => {
    ocrService['logo'] = OcrServiceEnum.getInfoByService(ocrService['type']).logo
  })
  return map
}

/**
 * 获取Ocr服务 - 只获取出可使用的
 */
export const getOcrServiceMapByUse = () => {
  const ocrServiceMapData = getOcrServiceMap()
  for (const [key, ocrService] of ocrServiceMapData.entries()) {
    if (!ocrService['useStatus'] || !ocrService['checkStatus']) {
      ocrServiceMapData.delete(key)
    }
  }
  return ocrServiceMapData
}

// @ts-ignore
export const buildOcrService = (ocrServiceEnum): {} => {
  const service = OcrServiceEnum.getInfoByService(ocrServiceEnum)
  const ocrService = {
    id: random(),
    ...service
  }
  switch (ocrServiceEnum) {
    case OcrServiceEnum.TTIME:
      return {
        ...ocrService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case OcrServiceEnum.TTIME_ONLINE:
      return {
        ...ocrService,
        useStatus: false,
        isBuiltIn: true,
        checkStatus: true
      }
    case OcrServiceEnum.BAIDU:
      return {
        ...ocrService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case OcrServiceEnum.VOLCANO:
      return {
        ...ocrService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false,
        model: VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR
      }
  }
}
