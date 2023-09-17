import axios from 'axios'
import ElMessageExtend from './messageExtend'
import { cacheGet } from './cacheUtil'
import { isNotNull } from '../../../common/utils/validate'

// 创建 axios
const service = axios.create({
  // 请求地址
  baseURL: process.env.BASE_API,
  // 请求超时时间(毫秒)
  timeout: 15000
})

/**
 * 请求拦截器
 * 发送请求前对请求体进行处理
 */
service.interceptors.request.use(
  (config) => {
    const token = cacheGet('token')
    if (isNotNull(token)) {
      // 设置用户token
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 得到请求响应体后对其进行处理
 */
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status === undefined) {
      return res
    } else if (res.status === -200) {
      // 登录失效则触发退出登录
      window.api.logoutEvent()
      // 请求失败 抛出错误信息
      ElMessageExtend.errorInOptions(res.msg, { duration: 5 * 1000 })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (res.status !== 200) {
      // 请求失败 抛出错误信息
      ElMessageExtend.errorInOptions(res.msg, { duration: 5 * 1000 })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res.data
  },
  (error) => {
    ElMessageExtend.errorInOptions('与服务器的连接断开 : ' + error.message, { duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service
