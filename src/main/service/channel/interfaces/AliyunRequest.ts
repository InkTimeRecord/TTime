import alimt20181012, * as $alimt20181012 from '@alicloud/alimt20181012'
import * as $OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'
import { injectAgentBySetAgentFieldName } from '../../../utils/RequestUtil'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info) => {
  const configInfo = {}
  await injectAgentBySetAgentFieldName(configInfo, 'httpsProxy')
  const config = new $OpenApi.Config({
    ...configInfo,
    accessKeyId: info.appId,
    accessKeySecret: info.appKey,
    keepAlive: true
  })
  // 访问的域名
  config.endpoint = 'mt.cn-hangzhou.aliyuncs.com'
  const client = new alimt20181012(config)
  const translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest({
    sourceLanguage: info.languageType,
    // 翻译文本的格式
    // html ( 网页格式 : 设置此参数将对待翻译文本以及翻译后文本按照html格式进行处理 )
    // text ( 文本格式 : 设置此参数将对传入待翻译文本以及翻译后结果不做文本格式处理，统一按纯文本格式处理 )
    formatType: 'text',
    targetLanguage: info.languageResultType,
    sourceText: info.translateContent,
    scene: 'general'
  })
  // 创建 RuntimeObject 实例并设置运行参数
  return await client.translateGeneralWithOptions(
    translateGeneralRequest,
    new $Util.RuntimeOptions({})
  )
}

export default {
  apiTranslate
}
