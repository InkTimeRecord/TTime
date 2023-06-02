import request from '../../../utils/request'
import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
  const data = {
    header: {
      fn: 'auto_translation_block'
    },
    source: {
      text_block: info.translateContent,
      lang: info.languageType
    },
    target: {
      lang: info.languageResultType
    }
  }
  return request({
    baseURL: 'https://transmart.qq.com',
    url: '/api/imt',
    method: HttpMethodType.POST,
    data: data
  })
}

export default {
  apiTranslate
}
