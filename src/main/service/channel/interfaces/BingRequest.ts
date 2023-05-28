import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import request from '../../../utils/request'

/**
 * 获取Token
 */
const getToken = (): Promise<string> => {
  return request({
    baseURL: 'https://edge.microsoft.com/',
    url: 'translate/auth',
    method: HttpMethodType.GET
  })
}

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
  if(info.languageType === 'auto') {
    info.languageType = ''
  }
  const content = info.translateContent
  const data = [{ 'Text': content }]
  return request({
    baseURL: 'https://api-edge.cognitive.microsofttranslator.com/',
    url: 'translate',
    method: HttpMethodType.POST,
    headers: {
      authorization: 'Bearer ' + info.token
    },
    params: {
      from: info.languageType,
      to: info.languageResultType,
      'api-version': '3.0',
      includeSentenceLength: true
    },
    data
  })
}

export default {
  getToken,
  apiTranslate
}
