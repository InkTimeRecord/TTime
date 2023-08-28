import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'
import md5 from 'md5-node'
import fs from 'fs'
import FormData from 'form-data'

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
const apiOcrGetToken = (info): Promise<AxiosPromise> => {
  return request({
    baseURL: 'https://aip.baidubce.com/',
    url:
      'oauth/2.0/token?client_id=' +
      info.appId +
      '&client_secret=' +
      info.appKey +
      '&grant_type=client_credentials',
    method: HttpMethodType.GET,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
}

/**
 * OCR图片翻译
 *
 * @param info OCR信息
 */
const apiOcrTranslate = async (info): Promise<AxiosPromise> => {
  console.log(info);
  const image = info.img
  const cuid = 'APICUID'
  const mac = 'mac'
  const formData = new FormData()
  const salt = new Date().getTime()
  const buffer = Buffer.from(image, 'base64')
  console.log('buffer =', buffer)
  // const imageFile = fs.readFileSync(buffer)
  const sign = md5(info.appId + md5(buffer) + salt + cuid + mac + info.appKey)
  formData.append('image', buffer,{
    contentType: 'multipart/form-data',
    header:{
      mime: 'image/png',
      fileName:'check.png',
    }
  })
  console.log('formData =', formData)
  console.log('formData.getHeaders() =', formData.getHeaders())

  return request({
    baseURL: 'https://fanyi-api.baidu.com/',
    url: 'api/trans/sdk/picture?from='+info.languageType+'&to=en&appid='+info.appId+'&salt='+salt+'&cuid='+cuid+'&mac='+mac+'&version=3&paste=0&sign='+sign,
    method: HttpMethodType.POST,
    headers: formData.getHeaders(),
    data: formData
  })
}

export default {
  apiTranslate,
  apiOcr,
  apiOcrGetToken,
  apiOcrTranslate
}
