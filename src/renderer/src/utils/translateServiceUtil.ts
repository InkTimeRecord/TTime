import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { cacheGet, cacheSet } from './cacheUtil'
import { isNull } from '../../../common/utils/validate'
import ServiceConfig from '../../../common/class/ServiceConfig'

/**
 * 保存翻译服务Map
 *
 * @param translateServiceMap 翻译服务Map
 */
export const setTranslateServiceMap = (translateServiceMap: Map<string, any>): void => {
  if (translateServiceMap.size > 0) {
    const translateServiceOne = translateServiceMap.entries().next().value[0]
    if (isNull(translateServiceOne['index'])) {
      let index = 0
      translateServiceMap.forEach((translateService) => {
        translateService['index'] = index
        index++
      })
    }
    translateServiceMap.forEach((translateService) => {
      delete translateService.serviceInfo
    })
  }
  const translateServiceMapFormat = Array.from(translateServiceMap.entries())
  cacheSet('translateServiceMap', translateServiceMapFormat)
  // 上面移除完毕保存后重新设置渠道信息
  translateServiceMap.forEach((translateService) => {
    translateService['serviceInfo'] = TranslateServiceBuilder.getInfoByService(
      translateService['type']
    )
    translateService['serviceName'] = isNull(translateService['serviceName'])
      ? translateService['serviceInfo']?.name
      : translateService['serviceName']
  })
}

/**
 * 获取翻译服务list
 */
export const getTranslateServiceMap = (): Map<any, any> => {
  let map: Map<any, any> = new Map(cacheGet('translateServiceMap'))
  if (map.size > 0) {
    // 因为之前的版本中的数据没有 index 所以这里默认获取第一条翻译源
    // 看是否有设置 index 如果没有默认赋值一遍
    const translateServiceOne = map.entries().next().value[0]
    if (isNull(translateServiceOne['index'])) {
      setTranslateServiceMap(map)
    }

    // 修复 Papago 翻译源类型配置为 PAPAGO 问题 改为 Papago 否则会因为大小写问题导致部分代码无法匹配
    let updatePapago = false
    map.forEach((translateService) => {
      if (translateService['type'] === 'PAPAGO') {
        translateService['type'] = TranslateServiceEnum.PAPAGO
        updatePapago = true
      }
    })
    if (updatePapago) {
      setTranslateServiceMap(map)
    }
  }
  map = new Map(cacheGet('translateServiceMap'))
  // 将 Map 转换为包含键值对数组的二维数组
  const entries = Array.from(map.entries())
  // 对二维数组按照对象的 index 属性进行排序
  entries.sort((a, b) => a[1]['index'] - b[1]['index'])
  // 创建一个新的有序 Map
  map = new Map(entries)
  // 此处设置渠道信息
  map.forEach((translateService) => {
    translateService['serviceInfo'] = TranslateServiceBuilder.getInfoByService(
      translateService['type']
    )
    translateService['serviceName'] = isNull(translateService['serviceName'])
      ? translateService['serviceInfo']?.name
      : translateService['serviceName']
  })
  return map
}

/**
 * 获取翻译服务 - 只获取出可使用的
 */
export const getTranslateServiceMapByUse = (): Map<unknown, unknown> => {
  const translateServiceMapData = getTranslateServiceMap()
  for (const [key, translateService] of translateServiceMapData.entries()) {
    if (!translateService['useStatus'] || !translateService['checkStatus']) {
      translateServiceMapData.delete(key)
    }
  }
  return translateServiceMapData
}

export const buildTranslateService = (type: any): {} => {
  const info: {
    name: string
    // 是否需要秘钥
    isKey: boolean
    // 是否单秘钥
    isOneAppKey: boolean
    // 构建时默认信息
    defaultInfo: object
    // 翻译语言
    languageList: []
  } = TranslateServiceBuilder.getServiceConfigInfo(type)
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

export class TranslateServiceBuilder {
  /**
   * 翻译服务信息Map
   */
  static translateServiceMap = new Map()

  /**
   * 翻译服务配置信息Map
   */
  static translateServiceConfigInfoMap = new Map()

  /**
   * 获取服务信息
   */
  static getServiceList(): Map<string, { name: string; type: string; logo: string }> {
    if (TranslateServiceBuilder.translateServiceMap.size > 1) {
      return TranslateServiceBuilder.translateServiceMap
    }
    // 动态加载服务logo
    const channelLogos = import.meta.glob('@assets/translate/*.(png|jpe?g|gif|svg)', {
      eager: true
    })
    Object.keys(TranslateServiceEnum)
      .filter((key) => typeof TranslateServiceEnum[key] === 'string')
      .map((key) => TranslateServiceEnum[key])
      .forEach((code) => {
        const channelLogoKey = Object.keys(channelLogos).find((channelLogoKey) =>
          channelLogoKey.includes(code + 'Logo')
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const logo = channelLogos[channelLogoKey].default
        TranslateServiceBuilder.translateServiceMap.set(
          code,
          TranslateServiceBuilder.buildServiceInfo(
            TranslateServiceBuilder.getServiceConfigInfo(code).name,
            code,
            logo
          )
        )
      })
    return TranslateServiceBuilder.translateServiceMap
  }

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum: any): { name: string; type: string; logo: string } {
    return TranslateServiceBuilder.translateServiceMap.get(serviceEnum)
  }

  /**
   * 构建服务信息对象
   *
   * @param name 服务名称
   * @param type 服务类型
   * @param logo 服务logo
   */
  static buildServiceInfo(name: string, type: string, logo: string): { name: string; type: string; logo: string } {
    return { name, type, logo }
  }

  /**
   * 获取服务配置信息
   */
  static getServiceConfigInfo(serviceEnum: any): {
    name: string
    // 是否需要秘钥
    isKey: boolean
    // 是否单秘钥
    isOneAppKey: boolean
    // 构建时默认信息
    defaultInfo: object
    // 翻译语言
    languageList: []
  } {
    return TranslateServiceBuilder.translateServiceConfigInfoMap.get(serviceEnum)
  }
}

// 获取所有翻译源配置信息 此处是异步加载 所以直接写在这里了 没有构建在方法 / 类中
const channelConfigModules = import.meta.glob('../../../common/channel/translate/info/*.ts')
// 构建翻译语言
for (const modulePath in channelConfigModules) {
  const moduleName = modulePath.split('/').pop().split('.')[0]
  const channelCode = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace('Info', '')
  const module = (await channelConfigModules[modulePath]()) as { default: { languageList: [] } }
  const infoList = module.default
  TranslateServiceBuilder.translateServiceConfigInfoMap.set(channelCode, infoList)
}

// 首次加载获取一下 用作数据初始化预加载
TranslateServiceBuilder.getServiceList()
