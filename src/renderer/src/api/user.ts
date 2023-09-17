import request from '../utils/request'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'

/**
 * 保存最新服务配置
 */
export function saveServiceInfo(data: any) {
  return request({
    url: 'translate/translateServiceInfo/saveServiceInfo',
    method: HttpMethodType.POST,
    data: data
  })
}

/**
 * 获取最新服务配置
 */
export function findNewByInfo(data: any) {
  return request({
    url: 'translate/translateServiceInfo/findNewByInfo',
    method: HttpMethodType.GET,
    params: data
  })
}

/**
 * 指定ID对应的记录重新构建最新版本
 */
export function updateByVersion(data: any) {
  return request({
    url: 'translate/translateServiceInfo/updateByVersion',
    method: HttpMethodType.PUT,
    data: data
  })
}

/**
 * 分页查询历史记录列表
 */
export function findHistoryList(data: any) {
  return request({
    url: 'translate/translateServiceInfo/findHistoryList',
    method: HttpMethodType.GET,
    params: data
  })
}

/**
 * 更新密钥
 */
export function updateKey(data: any) {
  return request({
    url: 'translate/translateServiceInfo/updateKey',
    method: HttpMethodType.PUT,
    data: data
  })
}
