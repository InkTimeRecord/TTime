import { isNull } from './validate'

/**
 * 公共错误处理
 *
 * @param title 标题
 * @param err 错误信息
 * @return 错误响应内容
 */
export const commonError = (title, err): string => {
  const errCode = err.code
  const errMessage = err.message
  const response = isNull(err.response) ? {} : err.response
  const errResponseStatus = response.status
  const errResponseStatusText = response.statusText
  const errResponseData = response.data
  window.api['logErrorEvent']('[' + title + '请求错误事件] - 异常响应报文 : ', {
      errCode: errCode,
      errMessage: errMessage,
      errResponseStatus: errResponseStatus,
      errResponseStatusText: errResponseStatusText,
      errResponseData: (typeof errResponseData) === 'object' ? JSON.stringify(errResponseData) : errResponseData
    }
  )
  const errResponseDataMessage = isNull(errResponseData)
    ? ''
    : isNull(errResponseData.error)
    ? errResponseData.message
      // 这块的三元表达式主要是拿取OpenAI响应值 之前 error.message 中会返回错误提示
      // 现在不知道为什么突然没有了，所以这里再做一层校验从  error.code 中读取
    : isNull(errResponseData.error.message)
      ? errResponseData.error.code
      : errResponseData.error.message
  let msg = ''
  if (errCode === 'ECONNREFUSED') {
    msg = '连接被拒绝，请检查配置的代理是否正确'
  } else if (errCode === 'ECONNRESET' && errMessage.indexOf('Client network socket disconnected before secure TLS connection was established') !== -1) {
    msg = '代理连接中断，请检查配置的代理是否可用'
  } else if (errCode === 'ECONNRESET' && errMessage.indexOf('read ECONNRESET') !== -1) {
    msg = '代理连接读取中断，请检查配置的代理是否可用'
  } else if (errMessage.indexOf('timeout of 15000ms exceeded') !== -1) {
    msg = '连接超过15秒无响应，请检查配置的代理是否可用'
  } else if (errMessage.indexOf('getaddrinfo ENOTFOUND') !== -1) {
    msg = '找不到连接地址，请检查配置的代理是否正确'
  } else {
    msg = isNull(errResponseDataMessage) ? errMessage : errResponseDataMessage
  }
  return msg
}
