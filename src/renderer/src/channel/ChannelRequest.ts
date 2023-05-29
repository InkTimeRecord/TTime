import { isNotNull } from '../utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { OpenAIChannelRequest } from './OpenAIChannelRequest'
import { BingChannelRequest } from './BingChannelRequest'

class ChannelRequest {

  /**
   * DeepL - 翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static deeplTranslate = (info, isCheckRequest) => {
    const data = {
      text: info.translateContent.split('\n'),
      target_lang: info.languageResultType
    }
    const languageType = info.languageType
    if (isNotNull(languageType) && languageType !== 'auto') {
      data['source_lang'] = languageType
    }
    const requestInfo = {
      baseURL: 'https://api-free.deepl.com/v2/translate',
      method: HttpMethodType.POST,
      headers: {
        'Authorization': 'DeepL-Auth-Key ' + info.appKey
      },
      data
    }
    request(requestInfo).then((data) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.DEEP_L, true, data, isCheckRequest ? info : null)
    }, (err) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.DEEP_L, false, commonError(TranslateServiceEnum.DEEP_L, err), isCheckRequest ? info : null)
    })
  }

  /**
   * Google - 翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static googleTranslate = (info, isCheckRequest): void => {
    const requestInfo = {
      baseURL: 'https://translation.googleapis.com',
      url: '/language/translate/v2?key=' + info.appKey,
      method: HttpMethodType.POST,
      data: {
        q: info.translateContent.split('\n'),
        target: info.languageResultType
      }
    }
    request(requestInfo).then((data) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.GOOGLE, true, data, isCheckRequest ? info : null)
    }, (err) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.GOOGLE, false, commonError(TranslateServiceEnum.GOOGLE, err), isCheckRequest ? info : null)
    })
  }

  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static openaiTranslate = (info, isCheckRequest): void => {
    if (isCheckRequest) {
      OpenAIChannelRequest.openaiCheck(info)
    } else {
      OpenAIChannelRequest.openaiTranslate(info)
    }
  }

  /**
   * bing - 翻译
   *
   * @param info 翻译信息
   */
  static bingTranslate = (info, _isCheckRequest): void => {
    BingChannelRequest.apiTranslateByBing(info)
  }

  /**
   * bing - 翻译
   *
   * @param info 翻译信息
   */
  static bingdictTranslate = (info, _isCheckRequest): void => {
    BingChannelRequest.apiTranslateByBingDict(info)
  }

}

/**
 * 代理模式 - api翻译
 *
 * @param type 翻译源类型
 * @param info 翻译源类型
 * @param isCheckRequest 是验证请求还是翻译请求
 */
window.api['agentApiTranslate']((type, info, isCheckRequest) => {
  ChannelRequest[type.toLowerCase() + 'Translate'](info, isCheckRequest)
})
