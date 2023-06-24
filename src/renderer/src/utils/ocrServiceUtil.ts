import { random } from '../../../common/utils/strUtil'
import OcrServiceEnum from '../../../common/enums/OcrServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'
import { isNull } from '../../../common/utils/validate'
import { VolcanoOcrModelEnum } from '../enums/VolcanoOcrModelEnum'
import logo from '../assets/logo.png'
import baiduLogo from '../assets/BaiduLogo.png'
import volcanoLogo from '../assets/VolcanoLogo.png'

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
    ocrService['logo'] = OcrServiceBuilder.getInfoByService(ocrService['type']).logo
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
  const service = OcrServiceBuilder.getInfoByService(ocrServiceEnum)
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

export class OcrServiceBuilder {
  /**
   * OCR服务信息Map
   */
  static ocrServiceMap = new Map()

  static getServiceList(): Map<string, { name; type; logo }> {
    if (OcrServiceBuilder.ocrServiceMap.size > 1) {
      return OcrServiceBuilder.ocrServiceMap
    }
    OcrServiceBuilder.ocrServiceMap.set(
      OcrServiceEnum.TTIME,
      OcrServiceBuilder.buildServiceInfo('TTimeOCR', OcrServiceEnum.TTIME, logo)
    )
    OcrServiceBuilder.ocrServiceMap.set(
      OcrServiceEnum.TTIME_ONLINE,
      OcrServiceBuilder.buildServiceInfo('TTime在线OCR', OcrServiceEnum.TTIME_ONLINE, logo)
    )
    OcrServiceBuilder.ocrServiceMap.set(
      OcrServiceEnum.BAIDU,
      OcrServiceBuilder.buildServiceInfo('百度OCR', OcrServiceEnum.BAIDU, baiduLogo)
    )
    OcrServiceBuilder.ocrServiceMap.set(
      OcrServiceEnum.VOLCANO,
      OcrServiceBuilder.buildServiceInfo('火山OCR', OcrServiceEnum.VOLCANO, volcanoLogo)
    )
    return OcrServiceBuilder.ocrServiceMap
  }

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum): { name; type; logo } {
    return OcrServiceBuilder.ocrServiceMap.get(serviceEnum)
  }

  /**
   * 构建服务信息对象
   *
   * @param name 服务名称
   * @param type 服务类型
   * @param logo 服务logo
   */
  static buildServiceInfo(name, type, logo): { name; type; logo } {
    return { name, type, logo }
  }
}

// 首次加载获取一下 用作数据初始化预加载
OcrServiceBuilder.getServiceList()
