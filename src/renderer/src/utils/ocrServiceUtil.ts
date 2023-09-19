import OcrServiceEnum from '../../../common/enums/OcrServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'
import { isNull } from '../../../common/utils/validate'
import ServiceConfig from '../../../common/class/ServiceConfig'

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
    ocrServiceMap.forEach((ocrService) => {
      delete ocrService.serviceInfo
    })
  }
  cacheSet('ocrServiceMap', Array.from(ocrServiceMap.entries()))
  // 上面移除完毕保存后重新设置渠道信息
  ocrServiceMap.forEach((translateService) => {
    translateService['serviceInfo'] = OcrServiceBuilder.getInfoByService(translateService['type'])
  })
}

/**
 * 获取Ocr服务list
 */
export const getOcrServiceMap = (): Map<any, any> => {
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
  // 此处设置渠道信息
  map.forEach((translateService) => {
    translateService['serviceInfo'] = OcrServiceBuilder.getInfoByService(translateService['type'])
  })
  return map
}

/**
 * 获取Ocr服务 - 只获取出可使用的
 */
export const getOcrServiceMapByUse = (): Map<unknown, unknown> => {
  const ocrServiceMapData = getOcrServiceMap()
  for (const [key, ocrService] of ocrServiceMapData.entries()) {
    if (!ocrService['useStatus'] || !ocrService['checkStatus']) {
      ocrServiceMapData.delete(key)
    }
  }
  return ocrServiceMapData
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
export const buildOcrService = (type): {} => {
  const info: {
    name: string
    // 是否需要秘钥
    isKey: boolean
    // 是否单秘钥
    isOneAppKey: boolean
    // 构建时默认信息
    defaultInfo: object
  } = OcrServiceBuilder.getServiceConfigInfo(type)
  if (isNull(info.defaultInfo)) {
    info.defaultInfo = {}
  }
  if (info?.isKey) {
    return ServiceConfig.buildKeyService({
      type: type,
      ...info.defaultInfo
    })
  } else {
    return ServiceConfig.buildIsBuiltInService({
      type: type,
      ...info.defaultInfo
    })
  }
}

export class OcrServiceBuilder {
  /**
   * OCR服务信息Map
   */
  static ocrServiceMap = new Map()

  /**
   * 服务配置信息Map
   */
  static ocrServiceConfigInfoMap = new Map()

  static getServiceList(): Map<string, { name; type; logo }> {
    if (OcrServiceBuilder.ocrServiceMap.size > 1) {
      return OcrServiceBuilder.ocrServiceMap
    }
    // 动态加载服务logo
    const channelLogos = import.meta.glob('@assets/ocr/*.(png|jpe?g|gif|svg)', { eager: true })
    Object.keys(OcrServiceEnum)
      .filter((key) => typeof OcrServiceEnum[key] === 'string')
      .map((key) => OcrServiceEnum[key])
      .forEach((code) => {
        const channelLogoKey = Object.keys(channelLogos).find((channelLogoKey) =>
          channelLogoKey.includes(code + 'Logo')
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const logo = channelLogos[channelLogoKey].default
        OcrServiceBuilder.ocrServiceMap.set(
          code,
          OcrServiceBuilder.buildServiceInfo(
            OcrServiceBuilder.getServiceConfigInfo(code).name,
            code,
            logo
          )
        )
      })
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

  /**
   * 获取服务配置信息
   */
  static getServiceConfigInfo(serviceEnum): {
    name: string
    // 是否需要秘钥
    isKey: boolean
    // 是否单秘钥
    isOneAppKey: boolean
    // 构建时默认信息
    defaultInfo: object
  } {
    return OcrServiceBuilder.ocrServiceConfigInfoMap.get(serviceEnum)
  }
}

// 获取所有翻译源配置信息 此处是异步加载 所以直接写在这里了 没有构建在方法 / 类中
const channelConfigModules = import.meta.glob('../../../common/channel/ocr/info/*.ts')
// 构建翻译语言
for (const modulePath in channelConfigModules) {
  const moduleName = modulePath.split('/').pop().split('.')[0]
  const channelCode = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace('Info', '')
  const module = (await channelConfigModules[modulePath]()) as { default }
  const infoList = module.default
  OcrServiceBuilder.ocrServiceConfigInfoMap.set(channelCode, infoList)
}

// 首次加载获取一下 用作数据初始化预加载
OcrServiceBuilder.getServiceList()
