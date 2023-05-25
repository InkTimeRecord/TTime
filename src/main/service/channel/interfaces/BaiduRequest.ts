import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'
import md5 from 'md5-node'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<AxiosPromise> => {
  const content = info.translateContent
  const salt = new Date().getTime()
  const sign = info.appId + content + salt + info.appKey
  const params = {
    q: content,
    from: info.languageType,
    to: info.languageResultType,
    appid: info.appId,
    salt: salt,
    sign: md5(sign)
  }
  return request({
    baseURL: 'https://fanyi-api.baidu.com/',
    url: 'api/trans/vip/translate',
    method: HttpMethodType.GET,
    params: params
  })
}

/**
 * OCR
 *
 * @param info OCR信息
 */
const apiOcr = (info): Promise<AxiosPromise> => {
  const data = {
    image: info.img
  }
  return request({
    baseURL: 'https://aip.baidubce.com/',
    url: 'rest/2.0/ocr/v1/general_basic?access_token=' + info.token,
    // url: 'rest/2.0/ocr/v1/general?access_token=' + info.token,
    // url:'rest/2.0/ocr/v1/accurate_basic?access_token=' + info.token,
    // url:'rest/2.0/ocr/v1/accurate?access_token=' + info.token,
    method: HttpMethodType.POST,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

/**
 * 获取 Ocr Token
 * @param info ocr信息
 */
const apiOcrGetToken = (info) => {
  return request({
    baseURL: 'https://aip.baidubce.com/',
    url: 'oauth/2.0/token?client_id=' + info.appId + '&client_secret=' + info.appKey + '&grant_type=client_credentials',
    method: HttpMethodType.GET,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}


export default {
  apiTranslate,
  apiOcr,
  apiOcrGetToken
}
