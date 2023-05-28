import ITranslateInterface from './ITranslateInterface'
import BingRequest from '../../interfaces/BingRequest'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../class/R'

class BingChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[Bing翻译事件] - 请求报文 : ', info)
    BingRequest.getToken().then(token => {
      log.info('[Bing获取Token事件] - 响应报文 : ', token)
      info.token = token
      BingRequest.apiTranslate(info).then((res) => {
        log.info('[Bing翻译事件] - 响应报文 : ', JSON.stringify(res))
        GlobalWin.mainWin.webContents.send('bing-api-translate-callback-event', R.okT(res[0]['translations'][0]['text']));
      }).catch((err) => {
        log.info('[Bing翻译事件] - 错误 : ', err.response.data)
        GlobalWin.mainWin.webContents.send('bing-api-translate-callback-event', R.okT(err.response.data.error.message))
      })
    })
  }

  apiTranslateCheck(_info): void {
  }

}

export default BingChannel
