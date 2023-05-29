import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import request from '../../../utils/request'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<string> => {
  const content = info.translateContent
  const params = {
    q: content,
    mkt: info.languageResultType,
  }
  return request({
    baseURL: 'https://www.bing.com/',
    url: 'dict/search',
    method: HttpMethodType.GET,
    params: params
  })
}

export default {
  apiTranslate
}
