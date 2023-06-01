import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import request from '../../../utils/request'

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
  const content = info.translateContent
  const id = 1000 * (Math.floor(Math.random() * 99999) + 8300000) + 1
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
      timestamp: Date.now(),
      commonJobParams: {
        wasSpoken: false,
        transcribe_as: ''
      }
    }
  })
  if ((id + 5) % 29 == 0 || (id + 3) % 13 == 0) {
    data = data.replace('"method":"', '"method" : "')
  } else {
    data = data.replace('"method":"', '"method": "')
  }
  return request({
    baseURL: 'https://www2.deepl.com',
    url: '/jsonrpc',
    method: HttpMethodType.POST,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: '*/*',
      'x-app-os-name': 'iOS',
      'x-app-os-version': '16.3.0',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'x-app-device': 'iPhone13,2',
      'User-Agent': 'DeepL-iOS/2.6.0 iOS 16.3.0 (iPhone13,2)',
      'x-app-build': '353933',
      'x-app-version': '2.6',
      Connection: 'keep-alive'
    },
    data: data
  })
}

export default {
  apiTranslate
}
