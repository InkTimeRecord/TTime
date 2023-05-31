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
      baseURL: 'https://translate.google.com',
      // dt- 可以多次包含并指定在回复中返回的内容
      // t- 源文本的翻译
      // at- 替代翻译
      // rm- 源和翻译文本的转录/音译
      // bd- 字典，如果源文本是一个词（你会得到文章的翻译、反向翻译等）
      // md- 源文本的定义，如果它是一个词
      // ss- 源文本的同义词，如果它是一个词
      // ex- 例子
      // rw- 另见清单
      url: '/translate_a/single?dt=at&dt=bd&dt=t',
      method: HttpMethodType.GET,
      params: {
        client: 'gtx',
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
