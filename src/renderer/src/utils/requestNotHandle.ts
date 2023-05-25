import axios from 'axios'

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
service.interceptors.request.use((config) => {
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
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
