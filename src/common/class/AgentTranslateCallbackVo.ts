/**
 * 代理翻译回调信息
 */
class AgentTranslateCallbackVo {
  /**
   * 请求报文信息
   */
  request: string

  /**
   * 响应报文信息
   */
  response: string

  constructor(request, response) {
    this.request = request
    this.response = response
  }
}

export default AgentTranslateCallbackVo
