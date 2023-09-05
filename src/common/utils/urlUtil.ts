/**
 * 解析自定义协议 Url
 *
 * @param url 地址
 */
export function parseCustomProtocolUrl(url): { path; queryParams } {
  // 使用正则表达式来解析URL中的所有查询参数键值对
  const queryString = url.split('?')[1]
  if (queryString) {
    let path = url.split('?')[0] // 获取路径部分
    if (path.startsWith('/')) {
      path = path.substring(1) // 去掉开头的斜杠
    }
    const queryParams = {}
    const params = queryString.split('&')
    params.forEach((param) => {
      const [key, value] = param.split('=')
      queryParams[key] = value
    })
    return {
      path,
      queryParams
    }
  }
  // URL不匹配自定义协议格式
  return null
}
