import request from '../../../utils/request'
import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import crypto from 'crypto'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info) => {
  const content = info.translateContent
  const salt = (new Date).getTime()
  const curtime = Math.round(new Date().getTime() / 1000)
  const sign = info.appId + truncate(content) + salt + curtime + info.appKey
  const data = {
    q: content,
    from: info.languageType,
    to: info.languageResultType,
    appKey: info.appId,
    salt: salt,
    sign: crypto.createHash('sha256').update(sign).digest('hex'),
    signType: 'v3',
    curtime: curtime
  }
  return request({
    baseURL: 'https://openapi.youdao.com/',
    url: 'api',
    method: HttpMethodType.POST,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

function truncate(q) {
  const len = q.length
  if (len <= 20) {
    return q
  }
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

export default {
  apiTranslate
}
