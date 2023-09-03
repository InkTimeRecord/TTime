import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<AxiosPromise> => {
  return request({
    url: 'translate/translate/',
    method: HttpMethodType.POST,
    data: info
  })
}

/**
 * OCR
 *
 * @param info OCR信息
 */
const apiOcr = (info): Promise<AxiosPromise> => {
  const data = {
    image: info.img.replace('data:image/png;base64,', '')
  }
  return request({
    url: 'translate/ocr/',
    method: HttpMethodType.POST,
    data: data
  })
}

/**
 * 翻译使用
 */
const translateUse = () => {
  return request({
    url: 'translate/use/',
    method: HttpMethodType.POST
  })
}

/**
 * 应用启动
 */
const appStart = () => {
  return request({
    url: 'translate/appStart/1612994709565333505',
    method: HttpMethodType.POST
  })
}

/**
 * 获取版本信息
 */
const getVersionInfo = () => {
  return request({
    url: 'translate/appStart/1612994709565333505',
    method: HttpMethodType.GET
  })
}

/**
 * 获取用户信息
 */
export function getInfo() {
  return request({
    url: "auth/ttime/getUserInfo"
  });
}

export default {
  apiTranslate,
  translateUse,
  appStart,
  getVersionInfo,
  apiOcr
}
