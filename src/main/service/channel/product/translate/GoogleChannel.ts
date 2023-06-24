import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class GoogleChannel extends TranslateAgent implements ITranslateAgentInterface {
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
        R.okT(GoogleChannel.commonErrorExpand(data))
      )
      return
    }
    log.info('[Google翻译事件] - 响应报文 : ', JSON.stringify(data))
    GlobalWin.mainWinSend(
      TranslateChannelFactory.callbackName(info.type),
      R.okT(
        data.data['translations'].map((translation) =>
          translation.translatedText.replaceAll('&#39;', "'")
        )
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
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    if (res.code === R.ERROR) {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.GOOGLE,
        R.errorMD(GoogleChannel.commonErrorExpand(data), responseData)
      )
      return
    }
    log.info('[Google翻译校验密钥事件] - 响应报文 : ', JSON.stringify(data))
    GlobalWin.setWin.webContents.send(
      'api-check-translate-callback-event',
      TranslateServiceEnum.GOOGLE,
      R.okD(responseData)
    )
  }

  /**
   * 公共错误处理
   *
   * @param msg   错误消息
   * @return 错误响应内容
   */
  static commonErrorExpand(msg): string {
    if (msg.indexOf('API key not valid. Please pass a valid API key') !== -1) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    } else if (msg.indexOf('The request is missing a valid API key') !== -1) {
      msg = '请求未传递API密钥 , 请检查后再试 , 如重复出现请联系开发者'
    }
    return msg
  }
}

export default GoogleChannel
