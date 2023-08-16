import { isNotNull, isNull } from '../../common/utils/validate'
import log from './log'
import createHttpsProxyAgent from 'https-proxy-agent'
import StoreService from '../service/StoreService'

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
  log.error('[' + title + '事件] - 异常响应报文 : ', {
    errCode: errCode,
    errMessage: errMessage,
    errResponseStatus: errResponseStatus,
    errResponseStatusText: errResponseStatusText,
    errResponseData:
      typeof errResponseData === 'object' ? JSON.stringify(errResponseData) : errResponseData
  })
  let msg = ''
  if (errCode === 'ECONNREFUSED') {
    msg = '连接被拒绝，请检查配置的代理是否正确'
  } else if (
    errCode === 'ECONNRESET' &&
    errMessage.indexOf(
      'Client network socket disconnected before secure TLS connection was established'
    ) !== -1
  ) {
    msg = '代理连接中断，请检查配置的代理是否可用'
  } else if (errCode === 'ECONNRESET' && errMessage.indexOf('read ECONNRESET') !== -1) {
    msg = '代理连接读取中断，请检查配置的代理是否可用'
  } else if (errMessage.indexOf('timeout of 15000ms exceeded') !== -1) {
    msg = '连接超过15秒无响应，请检查配置的代理是否可用'
  } else if (errMessage.indexOf('getaddrinfo ENOTFOUND') !== -1) {
    msg = '找不到连接地址，请检查配置的代理是否正确'
  } else {
    msg = isNull(errResponseData) ? errMessage : errResponseData
  }
  return msg
}

/**
 * 注入代理
 *
 * @param requestInfo 请求信息
 */
export const injectAgent = async (requestInfo): Promise<void> => {
  await injectAgentBySetAgentFieldName(requestInfo, 'httpsAgent')
}

/**
 * 注入代理
 *
 * @param requestInfo     请求信息
 * @param agentFieldName  根据字段名称设置代理信息
 */
export const injectAgentBySetAgentFieldName = async (
  requestInfo,
  agentFieldName
): Promise<void> => {
  const agentConfig = StoreService.configGet('agentConfig')
  if (
    isNotNull(agentConfig) &&
    isNotNull(agentConfig.host) &&
    isNotNull(agentConfig.port) &&
    agentConfig.type === 1
  ) {
    requestInfo[agentFieldName] = createHttpsProxyAgent({
      host: agentConfig.host,
      port: agentConfig.port
    })
    // if (isNotNull(agentConfig.userName) && isNotNull(agentConfig.passWord)) {
    //   requestInfo.auth = {
    //     username: agentConfig.userName,
    //     password: agentConfig.passWord
    //   }
    // }
  }
}

/**
 * 注入窗口代理
 *
 * @param agentConfig 代理配置
 * @param session 窗口会话信息
 */
export const injectWinAgent = (agentConfig, session): void => {
  session.closeAllConnections()
  if (
    isNotNull(agentConfig) &&
    isNotNull(agentConfig.host) &&
    isNotNull(agentConfig.port) &&
    agentConfig.type === 1
  ) {
    log.info('[窗口代理] - 开始设置')
    const agentUrl = getAgentUrl(agentConfig)
    session.setProxy({
      proxyRules: agentUrl
    })
    log.info('[窗口代理] - 结束设置')
  } else {
    // 移除 proxyRules 配置的代理信息并使用系统默认代理
    session.setProxy({
      proxyRules: null,
      mode: 'system'
    })
  }
}

/**
 * 注入Url代理
 *
 * @param agentConfig 代理配置
 * @param requestInfo     请求信息
 * @param agentFieldName  根据字段名称设置代理信息
 */
export const injectUrlAgent = (agentConfig, requestInfo, agentFieldName): void => {
  if (
    isNotNull(agentConfig) &&
    isNotNull(agentConfig.host) &&
    isNotNull(agentConfig.port) &&
    agentConfig.type === 1
  ) {
    requestInfo[agentFieldName] = getAgentUrl(agentConfig)
  }
}
/**
 * 注入窗口代理
 *
 * @param agentConfig 代理配置
 */
export const getAgentUrl = (agentConfig): string => {
  let url = `http://{{account}}${agentConfig.host}:${agentConfig.port}`
  // if (isNotNull(agentConfig.userName) && isNotNull(agentConfig.passWord)) {
  //   log.info("[窗口代理] - 配置代理账号")
  //   url = url.replace('{{account}}', `${agentConfig.userName}:${agentConfig.passWord}@`)
  // } else {
  //   url = url.replace('{{account}}', '')
  // }
  url = url.replace('{{account}}', '')
  return url
}
