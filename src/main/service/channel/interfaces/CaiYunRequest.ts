import request from '../../../utils/request'
import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
  const data = {
    source: [info.translateContent],
    trans_type: `${info.languageType}2${info.languageResultType}`,
    request_id: 'demo',
    detect: true
  }
  return request({
    baseURL: 'https://api.interpreter.caiyunai.com',
    url: '/v1/translator',
    method: HttpMethodType.POST,
    data: data,
    headers: {
      'content-type': 'application/json',
      'x-authorization': 'token ' + info.appKey
    }
  })
}

export default {
  apiTranslate
}
