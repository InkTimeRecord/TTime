import { random } from './strUtil'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { OpenAIModelEnum } from '../enums/OpenAIModelEnum'
import { cacheGet, cacheSet } from './cacheUtil'

/**
 * 保存翻译服务list
 *
 * @param translateServiceMap 翻译服务list
 */
export const setTranslateServiceMap = (translateServiceMap) => {
  cacheSet('translateServiceMap', Array.from(translateServiceMap.entries()))
}

/**
 * 获取翻译服务list
 */
export const getTranslateServiceMap = () => {
  const map = new Map(cacheGet('translateServiceMap'))
  // 此处重新更新一下logo 防止当在缓存中存储后 如果应用修改了文件路径 会导致读取logo图片失败
  map.forEach((translateService) => {
    translateService['logo'] = TranslateServiceEnum.getInfoByService(translateService['type']).logo
  })
  return map
}

/**
 * 获取翻译服务 - 只获取出可使用的
 */
export const getTranslateServiceMapByUse = () => {
  const translateServiceMapData = getTranslateServiceMap()
  for (const [key, translateService] of translateServiceMapData.entries()) {
    if (!translateService['useStatus'] || !translateService['checkStatus']) {
      translateServiceMapData.delete(key)
    }
  }
  return translateServiceMapData
}

// @ts-ignore
export const buildTranslateService = (translateServiceEnum): {} => {
  const service = TranslateServiceEnum.getInfoByService(translateServiceEnum)
  const translateService = {
    id: random(),
    ...service
  }
  switch (translateServiceEnum) {
    case TranslateServiceEnum.TTIME:
      return {
        ...translateService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case TranslateServiceEnum.TENCENT_CLOUD:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.BAIDU:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.ALIYUN:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.GOOGLE:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.GOOGLE_BUILT_IN:
      return {
        ...translateService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case TranslateServiceEnum.OPEN_AI:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false,
        model: OpenAIModelEnum.GPT_TURBO_35
      }
    case TranslateServiceEnum.YOU_DAO:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.DEEP_L:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.DEEP_L_BUILT_IN:
      return {
        ...translateService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case TranslateServiceEnum.VOLCANO:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.BING:
      return {
        ...translateService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case TranslateServiceEnum.BING_DICT:
      return {
        ...translateService,
        useStatus: true,
        isBuiltIn: true,
        checkStatus: true
      }
    case TranslateServiceEnum.NIU_TRANS:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.CAI_YUN:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
    case TranslateServiceEnum.TRAN_SMART:
      return {
        ...translateService,
        useStatus: false,
        isBuiltIn: false,
        appId: '',
        appKey: '',
        checkStatus: false
      }
  }
}
