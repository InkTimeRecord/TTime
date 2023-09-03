/**
 * 解析自定义协议 Url
 *
 * @param url 地址
 */
export function parseCustomProtocolUrl(url): { path, queryParams } {
  const match = url.match(/:\/\/([^?]+)\?(.+)/)
  if (match) {
    const path = match[1]
    const queryParams = {}
    match[2].split('&').forEach(param => {
      const [field, value] = param.split('=')
      queryParams[field] = value
    })
    return {
      path,
      queryParams
    }
  }
  // URL不匹配自定义协议格式
  return null
}
