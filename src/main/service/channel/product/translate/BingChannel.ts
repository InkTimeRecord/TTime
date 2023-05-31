import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import { paramsFilter } from '../../../../utils/logExtend'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import R from '../../../../class/R'

class BingChannel implements ITranslateInterface {
  static BING_TOKEN = ''

  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[Bing翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWinSend('agent-api-translate', TranslateServiceEnum.BING, info, false)
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   */
  static apiTranslateCallback(status, data): void {
    log.info('[Bing翻译事件] - 响应报文 : ', JSON.stringify(data))
    if (!status) {
      GlobalWin.mainWinSend('bing-api-translate-callback-event', R.okT(data))
      return
    }
    GlobalWin.mainWinSend(
      'bing-api-translate-callback-event',
      R.okT(data[0]['translations'][0]['text'])
    )
  }

  apiTranslateCheck(_info): void {}
}

export default BingChannel
