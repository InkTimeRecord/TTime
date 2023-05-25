import { random } from './strUtil'
import { OcrServiceEnum } from '../enums/OcrServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'

/**
 * 保存Ocr服务list
 *
 * @param ocrServiceMap Ocr服务list
 */
export const setOcrServiceMap = (ocrServiceMap) => {
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
  });
  return map
}

/**
 * 获取Ocr服务 - 只获取出可使用的
 */
export const getOcrServiceMapByUse = () => {
  let ocrServiceMapData = getOcrServiceMap()
  for (const [key, ocrService] of ocrServiceMapData.entries()) {
    if (!ocrService['useStatus'] || !ocrService['checkStatus']) {
      ocrServiceMapData.delete(key)
    }
  }
  return ocrServiceMapData
}

/**
 * 构建 TTime Ocr
 */
export const buildOcrTTimeService = () => {
  const service = OcrServiceEnum.getInfoByService(OcrServiceEnum.TTIME)
  return {
    id: random(),
    ...service,
    useStatus: true,
    isBuiltIn: true,
    checkStatus: true
  }
}

/**
 * 构建 TTime在线 Ocr
 */
export const buildOcrTTimeOnlineService = () => {
  const service = OcrServiceEnum.getInfoByService(OcrServiceEnum.TTIME_ONLINE)
  return {
    id: random(),
    ...service,
    useStatus: false,
    isBuiltIn: true,
    checkStatus: true
  }
}

/**
 * 构建百度 Ocr
 */
export const buildOcrBaiduService = () => {
  const service = OcrServiceEnum.getInfoByService(OcrServiceEnum.BAIDU)
  return {
    id: random(),
    ...service,
    useStatus: false,
    isBuiltIn: false,
    appId: '',
    appKey: '',
    checkStatus: false
  }
}
