import { isNull } from '../../../common/utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { AxiosPromise } from 'axios'

class BingChannelRequest {
  static BING_TOKEN = ''

  /**
   * 获取Token
   */
  static getToken = (): Promise<string> => {
    return request({
      baseURL: 'https://edge.microsoft.com/',
      url: 'translate/auth',
      method: HttpMethodType.GET
    })
  }

  /**
   * 刷新Token
   */
  static refreshToken = async (): Promise<void> => {
    window.api.logInfoEvent('[Bing获取Token事件] - 开始检测token ')
    if (isNull(BingChannelRequest.BING_TOKEN)) {
      window.api.logInfoEvent('[Bing获取Token事件] - Token不存在，开始初始化 ')
      // 不存在Token时进行获取
      await BingChannelRequest.getToken().then((token) => {
        window.api.logInfoEvent('[Bing获取Token事件] - Token获取成功：', token)
        BingChannelRequest.BING_TOKEN = token
      })
      return
    }
    // token存在则进行校验当前token有效期是否小于或等于一分钟 如果满足这个条件则刷新Token
    const tokenInfo = JSON.parse(window.atob(BingChannelRequest.BING_TOKEN.split('.')[1]))
    // 待校验的时间戳，秒级别
    const timestamp = tokenInfo['exp']
    // 当前时间的时间戳，转换为秒级别
    const currentTime = Math.floor(Date.now() / 1000)
    // 时间差，单位：秒
    const timeDifference = timestamp - currentTime
    if (timeDifference <= 60) {
      window.api.logInfoEvent('[Bing获取Token事件] - Token已失效，开始重新获取 ')
      // 剩余时间小于或等于一分钟 重新更新Token
      await BingChannelRequest.getToken()
        .then((token) => {
          window.api.logInfoEvent('[Bing获取Token事件] - Token获取成功：', token)
          BingChannelRequest.BING_TOKEN = token
        })
        .catch((err) => {
          window.api.logInfoEvent('[Bing获取Token事件] - 异常：', err)
        })
    }
  }

  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByBingRequest = async (info): Promise<AxiosPromise> => {
    if (info.languageType === 'auto') {
      info.languageType = ''
    }
    await BingChannelRequest.refreshToken()
    return request({
      baseURL: 'https://api-edge.cognitive.microsofttranslator.com/',
      url: 'translate',
      method: HttpMethodType.POST,
      headers: {
        authorization: 'Bearer ' + BingChannelRequest.BING_TOKEN
      },
      params: {
        from: info.languageType,
        to: info.languageResultType,
        'api-version': '3.0',
        includeSentenceLength: true
      },
      data: [{ Text: info.translateContent }]
    })
  }

  /**
   * Bing翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByBing = (info): void => {
    BingChannelRequest.apiTranslateByBingRequest(info).then(
      (data) => {
        window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
      },
      (err) => {
        window.api['agentApiTranslateCallback'](
          R.errorD(new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.BING, err)))
        )
      }
    )
  }

  /**
   * 字典翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByBingDict = (info): void => {
    // 这里调用bing的翻译接口进行查询结果 因为bing字典有些词或句子查不出
    // 这里作补充作用
    BingChannelRequest.apiTranslateByBingRequest(info)
      .then((bingRes) => {
        window.api.logInfoEvent('[Bing翻译事件] - 响应报文：', JSON.stringify(bingRes))
        window.api['agentApiTranslateCallback'](
          R.okD(
            new AgentTranslateCallbackVo(info, {
              text: bingRes[0]['translations'][0]['text'],
              ...info.dictResponse
            })
          )
        )
      })
      .catch((err) => {
        window.api.logInfoEvent('[Bing翻译事件] - 异常：', err)
        window.api['agentApiTranslateCallback'](
          R.errorD(new AgentTranslateCallbackVo(info, commonError('Bing翻译事件', err)))
        )
      })
  }
}

export { BingChannelRequest }
