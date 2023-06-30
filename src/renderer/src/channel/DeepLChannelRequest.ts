import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { isNotNull } from '../../../common/utils/validate'

class DeepLChannelRequest {
  /**
   * DeepL翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByDeepL = (info): void => {
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
        Authorization: 'DeepL-Auth-Key ' + info.appKey
      },
      data
    }
    request(requestInfo).then(
      (data) => {
        window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
      },
      (err) => {
        window.api['agentApiTranslateCallback'](
          R.errorD(
            new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.DEEP_L, err))
          )
        )
      }
    )
  }

  /**
   * DeepL翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByDeepLBuiltIn = (info): void => {
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
        window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, res)))
      })
      .catch((error) => {
        window.api['agentApiTranslateCallback'](
          R.errorD(
            new AgentTranslateCallbackVo(
              info,
              commonError(TranslateServiceEnum.DEEP_L_BUILT_IN, error)
            )
          )
        )
      })
  }
}

export { DeepLChannelRequest }
