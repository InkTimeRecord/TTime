import { isNull } from '../utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
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
    console.log('BingChannelRequest.BING_TOKEN = ' , BingChannelRequest.BING_TOKEN)
    // token存在则进行校验当前token有效期是否小于或等于一分钟 如果满足这个条件则刷新Token
    const tokenInfo = Buffer.from(BingChannelRequest.BING_TOKEN.split('.')[1], 'base64').toString()
    // 待校验的时间戳，秒级别
    const timestamp = tokenInfo['exp']
    // 当前时间的时间戳，转换为秒级别
    const currentTime = Math.floor(Date.now() / 1000)
    // 时间差，单位：秒
    const timeDifference = timestamp - currentTime
    if (timeDifference <= 60) {
      window.api.logInfoEvent('[Bing获取Token事件] - Token已失效，开始重新获取 ')
      // 剩余时间小于或等于一分钟 重新更新Token
      await BingChannelRequest.getToken().then((token) => {
        window.api.logInfoEvent('[Bing获取Token事件] - Token获取成功：', token)
        BingChannelRequest.BING_TOKEN = token
      }).catch((err) => {
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
    console.log('refreshToken = ')
    await BingChannelRequest.refreshToken()
    console.log('apiTranslateByBingRequest = ' , info)
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
   * 翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByBing = async (info): Promise<void> => {
    BingChannelRequest.apiTranslateByBingRequest(info).then((data) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.BING, true, data, info)
    }, (err) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.BING, false, commonError(TranslateServiceEnum.BING, err), info)
    })
  }

  static dictRegex = (res: string): {
    usPhonetic: string,
    ukPhonetic: string,
    usSpeech: string,
    ukSpeech: string,
    explains: Array<string>,
    wfs: Array<{ wf: { name: string, value: string } }>
  } => {
    let match
    const explains: Array<string> = []
    // 匹配 其他释义字段信息 其他释义分化为了两段 下面一起匹配合并
    const explainOtherRegex = /<span class="pos">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
    const explainNetworkRegex = /<span class="pos web">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
    while ((match = explainOtherRegex.exec(res)) !== null) {
      explains.push(match[1] + ' ' + match[2])
    }
    while ((match = explainNetworkRegex.exec(res)) !== null) {
      explains.push(match[1] + '. ' + match[2])
    }
    // 匹配音标及语音
    const phoneticAndSpeechRegex = /<div class="hd_prUS b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" href="javascript:void\(0\);" h="ID=Dictionary,(.*?)"><\/a><\/div><div class="hd_pr b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)"/g
    let usPhonetic = ''
    let ukPhonetic = ''
    let usSpeech = ''
    let ukSpeech = ''
    while ((match = phoneticAndSpeechRegex.exec(res)) !== null) {
      usPhonetic = match[2]
      ukPhonetic = match[7]
      usSpeech = match[3]
      ukSpeech = match[8]
    }
    // 匹配语法类别
    const wfs: Array<{ wf: { name: string, value: string } }> = []
    const wfsRegex = /<span class="b_primtxt">(.*?)<\/span><a class="p1-5" title="" href="(.*?)" h="ID=Dictionary,(.*?)">(.*?)<\/a>/g
    while ((match = wfsRegex.exec(res)) !== null) {
      wfs.push({ wf: { name: match[1], value: match[4] } })
    }
    return {
      usPhonetic,
      ukPhonetic,
      usSpeech,
      ukSpeech,
      explains,
      wfs
    }
  }

  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  static apiTranslateByBingDict = async (info): Promise<void> => {
    const content = info.translateContent
    const params = {
      q: content,
      mkt: info.languageResultType
    }
    request({
      baseURL: 'https://www.bing.com/',
      url: 'dict/search',
      method: HttpMethodType.GET,
      params: params
    }).then((res) => {
      BingChannelRequest.apiTranslateByBingRequest(info)
        .then((bingRes) => {
          window.api.logInfoEvent('[Bing翻译事件] - 响应报文：', JSON.stringify(bingRes))
          window.api['agentApiTranslateCallback'](TranslateServiceEnum.BING_DICT, true, {
            text: bingRes[0]['translations'][0]['text'],
            ...BingChannelRequest.dictRegex(res)
          }, info)
        }).catch((err) => {
        window.api.logInfoEvent('[Bing翻译事件] - 异常：', err)
        window.api['agentApiTranslateCallback'](TranslateServiceEnum.BING_DICT, true, commonError('Bing翻译事件', err), info)
      })
    }, (err) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.BING_DICT, false, commonError('BingDict翻译事件', err), info)
    })
  }
}

export { BingChannelRequest }
