import request from '../../../utils/request'
import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
  const data = {
    from: info.languageType,
    to: info.languageResultType,
    apikey: info.appKey,
    src_text: info.translateContent
  }
  return request({
    baseURL: 'https://api.niutrans.com',
    url: '/NiuTransServer/translation',
    method: HttpMethodType.POST,
    data: data
  })
}

export default {
  apiTranslate
}
