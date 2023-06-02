import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TranSmartRequest from '../../interfaces/TranSmartRequest'
import { commonError } from '../../../../utils/RequestUtil'
import { isNull } from '../../../../utils/validate'

class TranSmartChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[腾讯交互翻译(内置)事件] - 请求报文 : ', paramsFilter(info))
    TranSmartRequest.apiTranslate(info)
      .then((res) => {
        log.info('[腾讯交互翻译(内置)事件] - 响应报文 : ', res)
        const autoTranslation = res['auto_translation']
        if (isNull(autoTranslation)) {
          const errMessage = this.getMsgByErrorCode(res['message'])
          GlobalWin.mainWinSend('transmart-api-translate-callback-event', R.okT(errMessage))
          return
        }
        GlobalWin.mainWinSend('transmart-api-translate-callback-event', R.okT(autoTranslation))
      })
      .catch((err) => {
        GlobalWin.mainWinSend(
          'transmart-api-translate-callback-event',
          R.okT(commonError('腾讯交互翻译(内置)', err))
        )
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(_info): void {}

  /**
   * 按错误代码获取消息
   *
   * @param errorCode 错误信息
   */
  getMsgByErrorCode(errorCode): string {
    let msg = errorCode
    if (errorCode === 'Required engine is not found') {
      msg = '不支持的语言类型'
    }
    return msg
  }
}

export default TranSmartChannel
