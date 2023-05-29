import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import { paramsFilter } from '../../../../utils/logExtend'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'

class BingChannel implements ITranslateInterface {

  static BING_TOKEN = ''

  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {

    log.info('[Bing翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send('agent-api-translate', TranslateServiceEnum.BING, info, false)
    // log.info('[Bing翻译事件] - 请求报文 : ', info)
    // BingRequest.apiTranslate(info).then((res) => {
    //   log.info('[Bing翻译事件] - 响应报文 : ', JSON.stringify(res))
    //   GlobalWin.mainWin.webContents.send('bing-api-translate-callback-event', R.okT(res[0]['translations'][0]['text']))
    // }).catch((err) => {
    //   log.info('[Bing翻译事件] - 错误 : ', err.response.data)
    //   GlobalWin.mainWin.webContents.send('bing-api-translate-callback-event', R.okT(err.response.data.error.message))
    // })
  }
  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   */
  static apiTranslateCallback(status, data): void {
    console.log(status)
    console.log(data)
    return
  }

  apiTranslateCheck(_info): void {
  }

}

export default BingChannel
