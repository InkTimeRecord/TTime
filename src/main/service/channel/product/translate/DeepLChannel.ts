import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../class/R'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'

class DeepLChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[DeepL翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.DEEP_L,
      info,
      false
    )
  }

  apiTranslateCheck(info): void {
    log.info('[DeepL翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.DEEP_L,
      info,
      true
    )
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   */
  static apiTranslateCallback(status, data): void {
    if (status) {
      log.info('[DeepL翻译事件] - 响应报文 : ', data)
      GlobalWin.mainWin.webContents.send(
        'deepl-api-translate-callback-event',
        R.okT(data['translations'].map((translation) => translation.text))
      )
    } else {
      GlobalWin.mainWin.webContents.send(
        'deepl-api-translate-callback-event',
        R.okT(DeepLChannel.commonErrorExpand(data))
      )
    }
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   * @param info   数据
   */
  static apiTranslateCheckCallback(status, data, info): void {
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    if (status) {
      log.info('[DeepL翻译校验密钥事件] - 响应报文 : ', data)
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.DEEP_L,
        R.okD(responseData)
      )
    } else {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.DEEP_L,
        R.errorMD(DeepLChannel.commonErrorExpand(data), responseData)
      )
    }
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
