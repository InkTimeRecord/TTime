import ITranslateInterface from './ITranslateInterface'
import DeepLBuiltInRequest from '../../interfaces/DeepLBuiltInRequest'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../class/R'

class GoogleBuiltInChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[DeepL(内置)翻译事件] - 请求报文 : ', paramsFilter(info))
    DeepLBuiltInRequest.apiTranslate(info)
      .then((res) => {
        log.info('[DeepL(内置)翻译事件] - 响应报文 : ', JSON.stringify(res))
        //   GlobalWin.mainWinSend('deeplbuiltin-api-translate-callback-event', R.okD(vo))
      })
      .catch((err) => {
        log.info('[DeepL(内置)翻译事件] - 异常 : ', err)
        GlobalWin.mainWinSend('deeplbuiltin-api-translate-callback-event', R.okT(err))
      })
  }

  apiTranslateCheck(_info): void {}
}

export default GoogleBuiltInChannel
