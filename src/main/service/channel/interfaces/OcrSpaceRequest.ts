import { AxiosPromise } from 'axios'
import request from '../../../utils/request'
import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'

/**
 * OCR
 *
 * @param info OCR信息
 */
const apiOcr = (info): Promise<AxiosPromise> => {
  const data = {
    apikey: info.appKey,
    OCREngine: info.model,
    base64Image: info.img,
    language: info.languageType,
    scale: true
  }
  return request({
    baseURL: 'https://api.ocr.space',
    url: '/parse/image',
    method: HttpMethodType.POST,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}
export default {
  apiOcr
}
