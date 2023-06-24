import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TranSmartRequest from '../../interfaces/TranSmartRequest'
import { commonError } from '../../../../utils/RequestUtil'
import { isNull } from '../../../../../common/utils/validate'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class TranSmartChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    TranSmartRequest.apiTranslate(info)
      .then((res) => {
        log.info('[腾讯交互翻译(内置)事件] - 响应报文 : ', res)
        const autoTranslation = res['auto_translation']
        if (isNull(autoTranslation)) {
          const errMessage = this.getMsgByErrorCode(res['message'])
          GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT(errMessage))
          return
        }
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okT(autoTranslation)
        )
      })
      .catch((err) => {
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okT(commonError('腾讯交互翻译(内置)', err))
        )
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
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
