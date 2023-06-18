import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<AxiosPromise> => {
  if (info.languageResultType === 'zh') {
    // 默认检测到中文时直接返回的zh 没有从语言表中读取 这块之后需要重构 这里暂时写死
    info.languageResultType = 'zh-CN'
  }
  const data = {
    text: info.translateContent,
    source: info.languageType,
    target: info.languageResultType
  }
  return request({
    baseURL: 'https://openapi.naver.com',
    url: '/v1/papago/n2mt',
    method: HttpMethodType.POST,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Naver-Client-Id': info.appId,
      'X-Naver-Client-Secret': info.appKey
    }
  })
}

export default {
  apiTranslate
}
