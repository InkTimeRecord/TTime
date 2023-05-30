import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'

class GoogleChannelRequest {
  /**
   * Google翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static apiTranslateByGoogle = (info, isCheckRequest): void => {
    const requestInfo = {
      baseURL: 'https://translation.googleapis.com',
      url: '/language/translate/v2?key=' + info.appKey,
      method: HttpMethodType.POST,
      data: {
        q: info.translateContent.split('\n'),
        target: info.languageResultType
      }
    }
    request(requestInfo).then(
      (data) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.GOOGLE,
          true,
          data,
          isCheckRequest ? info : null
        )
      },
      (err) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.GOOGLE,
          false,
          commonError(TranslateServiceEnum.GOOGLE, err),
          isCheckRequest ? info : null
        )
      }
    )
  }

  /**
   * Google翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static apiTranslateByGoogleBuiltIn = (info, isCheckRequest): void => {
    const requestInfo = {
      baseURL: 'https://translate.googleapis.com',
      url: '/translate_a/single',
      method: HttpMethodType.GET,
      params: {
        client: 'gtx',
        dt: 't',
        sl: info.languageType,
        tl: info.languageResultType,
        q: info.translateContent
      }
    }
    request(requestInfo).then(
      (data) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.GOOGLE_BUILT_IN,
          true,
          data,
          isCheckRequest ? info : null
        )
      },
      (err) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.GOOGLE_BUILT_IN,
          false,
          commonError(TranslateServiceEnum.GOOGLE_BUILT_IN, err),
          isCheckRequest ? info : null
        )
      }
    )
  }
}

export { GoogleChannelRequest }
