import { random } from './strUtil'
import { OcrServiceEnum } from '../enums/OcrServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'

/**
 * 保存Ocr服务list
 *
 * @param ocrServiceMap Ocr服务list
 */
export const setOcrServiceMap = (ocrServiceMap): void => {
  cacheSet('ocrServiceMap', Array.from(ocrServiceMap.entries()))
}

/**
 * 获取Ocr服务list
 */
export const getOcrServiceMap = () => {
  const map = new Map(cacheGet('ocrServiceMap'))
  // 此处重新更新一下logo 防止当在缓存中存储后 如果应用修改了文件路径 会导致读取logo图片失败
  map.forEach((translateService) => {
    translateService['logo'] = OcrServiceEnum.getInfoByService(translateService['type']).logo
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
        checkStatus: false
      }
  }
}
