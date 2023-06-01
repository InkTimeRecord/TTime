import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'

class DeepLChannelRequest {
  /**
   * DeepL翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static apiTranslateByDeepL = (info, isCheckRequest): void => {
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
   * DeepL翻译
   *
   * @param info 翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static apiTranslateByDeepLBuiltIn = (info, isCheckRequest): void => {
    const content = info.translateContent
    const id = 1000 * (Math.floor(Math.random() * 99999) + 8300000) + 1
    let ts = Date.now()
    let ICounts = 0
    for (let i = 0; i < content.length; i++) {
      if (content[i] === 'i') {
        ICounts++
      }
    }
    if (ICounts != 0) {
      ICounts++
      ts = ts - (ts % ICounts) + ICounts
    }
    let data = JSON.stringify({
      id,
      jsonrpc: '2.0',
      method: 'LMT_handle_texts',
      params: {
        texts: [
          {
            text: content,
            requestAlternatives: 3
          }
        ],
        splitting: 'newlines',
        lang: {
          source_lang_user_selected: info.languageType,
          target_lang: info.languageResultType
        },
        timestamp: ts,
        commonJobParams: {
          wasSpoken: false,
          transcribe_as: ''
        }
      }
    })
    if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
      data = data.replace('"method":"', '"method" : "')
    } else {
      data = data.replace('"method":"', '"method": "')
    }
    request({
      baseURL: 'https://www2.deepl.com',
      url: '/jsonrpc',
      method: HttpMethodType.POST,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data: data
    })
      .then((res) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.DEEP_L_BUILT_IN,
          true,
          res,
          isCheckRequest ? info : null
        )
      })
      .catch((error) => {
        window.api['agentApiTranslateCallback'](
          TranslateServiceEnum.DEEP_L_BUILT_IN,
          false,
          commonError('DeepL(内置)', error),
          isCheckRequest ? info : null
        )
      })
  }
}

export { DeepLChannelRequest }
