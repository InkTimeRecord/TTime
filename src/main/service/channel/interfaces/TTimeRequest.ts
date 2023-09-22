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
const translateUse = (): Promise<AxiosPromise> => {
  return request({
    url: 'translate/use/',
    method: HttpMethodType.POST
  })
}

/**
 * 应用启动
 */
const appStart = (): Promise<AxiosPromise> => {
  return request({
    url: 'translate/appStart/1612994709565333505',
    method: HttpMethodType.POST
  })
}

/**
 * 获取版本信息
 */
const getVersionInfo = (): Promise<AxiosPromise> => {
  return request({
    url: 'translate/appStart/1612994709565333505',
    method: HttpMethodType.GET
  })
}

/**
 * 获取用户信息
 */
const getUserInfo = (token): Promise<AxiosPromise> => {
  return request({
    url: 'auth/ttime/getUserInfo',
    headers: {
      token: token
    }
  })
}

/**
 * 退出登录
 */
const logout = (): Promise<void> => {
  return request({
    url: 'auth/ttime/logout',
    method: HttpMethodType.DELETE
  })
}

/**
 * 获取用户配置
 */
const getUserConfig = (): Promise<void> => {
  return request({
    url: 'translate/translateUserConfig/',
    method: HttpMethodType.GET
  })
}

/**
 * 获取用户配置 - 根据key
 */
const getUserConfigByKey = (data): Promise<void> => {
  return request({
    url: 'translate/translateUserConfig/findByKey',
    method: HttpMethodType.GET,
    params: data
  })
}

/**
 * 保存用户配置
 */
const saveUserConfig = (data): Promise<void> => {
  return request({
    url: 'translate/translateUserConfig/',
    method: HttpMethodType.POST,
    data: data
  })
}

/**
 * 批量保存用户配置
 */
const batchSaveUserConfig = (data): Promise<void> => {
  return request({
    url: 'translate/translateUserConfig/batch',
    method: HttpMethodType.POST,
    data: data
  })
}

export default {
  apiTranslate,
  translateUse,
  appStart,
  getVersionInfo,
  apiOcr,
  getUserInfo,
  logout,
  getUserConfig,
  getUserConfigByKey,
  saveUserConfig,
  batchSaveUserConfig
}
