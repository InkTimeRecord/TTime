import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'
import https from 'https'

// 创建一个忽略SSL证书验证的agent
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<AxiosPromise> => {
  // 如果info.languageType === auto，替换为en
  if (info.languageType === 'auto') {
    info.languageType = 'en'  
  }
  const body = {
    from: info.languageType,
    to: info.languageResultType,
    text: info.translateContent
  }
  return request({
    baseURL: info.requestUrl,
    url: '/translate',
    method: HttpMethodType.POST,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${info.appKey}`
    },
    data: body,
    httpsAgent // 使用忽略SSL证书验证的agent
  })
}

/**
 * 健康检查
 *
 * @param info 检查信息
 */
const healthCheck = (info): Promise<AxiosPromise> => {
  return request({
    baseURL: info.requestUrl,
    url: '/health',
    method: HttpMethodType.GET,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${info.appKey}`
    },
    httpsAgent // 使用忽略SSL证书验证的agent
  })
}

export default {
  apiTranslate,
  healthCheck
}