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
  });
  return map
}

/**
 * 获取翻译服务 - 只获取出可使用的
 */
export const getTranslateServiceMapByUse = () => {
  let translateServiceMapData = getTranslateServiceMap()
  for (const [key, translateService] of translateServiceMapData.entries()) {
    if (!translateService['useStatus'] || !translateService['checkStatus']) {
      translateServiceMapData.delete(key)
    }
  }
  return translateServiceMapData
}

/**
 * 构建时记翻译源
 */
export const buildTTimeService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.TTIME)
  return {
    id: random(),
    ...service,
    useStatus: true,
    isBuiltIn: true,
    checkStatus: true
  }
}

/**
 * 构建腾讯云翻译源
 */
export const buildTencentCloudService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.TENCENT_CLOUD)
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

/**
 * 构建百度翻译源
 */
export const buildBaiduService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.BAIDU)
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

/**
 * 构建阿里云翻译源
 */
export const buildAliyunService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.ALIYUN)
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

/**
 * 构建Google翻译源
 */
export const buildGoogleService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.GOOGLE)
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

/**
 * 构建OpenAI翻译源
 */
export const buildOpenAIService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.OPEN_AI)
  return {
    id: random(),
    ...service,
    useStatus: false,
    isBuiltIn: false,
    appId: '',
    appKey: '',
    checkStatus: false,
    model: OpenAIModelEnum.GPT_TURBO_35
  }
}

/**
 * 构建有道翻译源
 */
export const buildYouDaoService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.YOU_DAO)
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

/**
 * 构建DeepL翻译源
 */
export const buildDeepLService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.DEEP_L)
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

/**
 * 构建火山翻译源
 */
export const buildVolcanoService = () => {
  const service = TranslateServiceEnum.getInfoByService(TranslateServiceEnum.VOLCANO)
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



