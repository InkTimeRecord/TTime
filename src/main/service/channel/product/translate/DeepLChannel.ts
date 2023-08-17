import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../../common/class/R'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class DeepLChannel extends TranslateAgent implements ITranslateAgentInterface {
  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCallback(res: R): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    if (res.code === R.ERROR) {
      GlobalWin.mainWinSend(
        TranslateChannelFactory.callbackName(info.type),
        R.okIT(info, DeepLChannel.commonErrorExpand(data))
      )
      return
    }
    log.info('[DeepL翻译事件] - 响应报文 : ', data)
    GlobalWin.mainWinSend(
      TranslateChannelFactory.callbackName(info.type),
      R.okIT(
        info,
        data['translations'].map((translation) => translation.text)
      )
    )
  }

  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCheckCallback(res): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    if (res.code === R.ERROR) {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.DEEP_L,
        R.errorMD(DeepLChannel.commonErrorExpand(data), info.responseData)
      )
      return
    }
    log.info('[DeepL翻译校验密钥事件] - 响应报文 : ', data)
    GlobalWin.setWin.webContents.send(
      'api-check-translate-callback-event',
      TranslateServiceEnum.DEEP_L,
      R.okD(info.responseData)
    )
  }

  /**
   * 公共错误处理
   *
   * @param msg   错误消息
   * @return 错误响应内容
   */
  static commonErrorExpand(msg): string {
    if (msg.indexOf('Request failed with status code 403') !== -1) {
      msg = 'API密钥无法使用或其他错误 , 请检查后再试'
    } else if (msg.indexOf("Value for 'source_lang' not supported.") !== -1) {
      msg = '不支持翻译当前语言'
    }
    return msg
  }
}

export default DeepLChannel
