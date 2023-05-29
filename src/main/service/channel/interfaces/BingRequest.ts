import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import request from '../../../utils/request'
import { isNull } from '../../../utils/validate'
import log from '../../../utils/log'

let BING_TOKEN = ''

/**
 * 获取Token
 */
const getToken = (): Promise<string> => {
  return request({
    baseURL: 'https://edge.microsoft.com/',
    url: 'translate/auth',
    method: HttpMethodType.GET,
  })
}

/**
 * 刷新Token
 */
const refreshToken = async (): Promise<void> => {
  log.info('[Bing获取Token事件] - 开始检测token')
  if (isNull(BING_TOKEN)) {
    log.info('[Bing获取Token事件] - Token不存在，开始初始化')
    // 不存在Token时进行获取
    await getToken().then((token) => {
      BING_TOKEN = token
    })
  }
  // token存在则进行校验当前token有效期是否小于或等于一分钟 如果满足这个条件则刷新Token
  const tokenInfo = Buffer.from(BING_TOKEN.split('.')[1], 'base64').toString()
  // 待校验的时间戳，秒级别
  const timestamp = tokenInfo['exp']
  // 当前时间的时间戳，转换为秒级别
  const currentTime = Math.floor(Date.now() / 1000)
  // 时间差，单位：秒
  const timeDifference = timestamp - currentTime
  if (timeDifference <= 60) {
    log.info('[Bing获取Token事件] - Token已失效，开始重新获取')
    // 剩余时间小于或等于一分钟 重新更新Token
    await getToken().then((token) => {
      log.info('[Bing获取Token事件] - Token获取成功：', token)
      BING_TOKEN = token
    }).catch((err) => {
      log.error('[Bing获取Token事件] - 异常：', err)
    })
  }
}

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<object> => {
  if (info.languageType === 'auto') {
    info.languageType = ''
  }
  await refreshToken()
  const content = info.translateContent
  const data = [{ 'Text': content }]
  return request({
    baseURL: 'https://api-edge.cognitive.microsofttranslator.com/',
    url: 'translate',
    method: HttpMethodType.POST,
    headers: {
      authorization: 'Bearer ' + BING_TOKEN
    },
    params: {
      from: info.languageType,
      to: info.languageResultType,
      'api-version': '3.0',
      includeSentenceLength: true
    },
    data
  })
}

export default {
  getToken,
  refreshToken,
  apiTranslate
}
