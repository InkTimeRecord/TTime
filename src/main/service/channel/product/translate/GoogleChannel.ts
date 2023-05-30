import log from '../../../../utils/log'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { paramsFilter } from '../../../../utils/logExtend'

class GoogleChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[Google翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.GOOGLE,
      info,
      false
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[Google翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.GOOGLE,
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
      log.info('[Google翻译事件] - 响应报文 : ', JSON.stringify(data))
      GlobalWin.mainWin.webContents.send(
        'google-api-translate-callback-event',
        R.okT(
          data.data['translations'].map((translation) =>
            translation.translatedText.replaceAll('&#39;', "'")
          )
        )
      )
    } else {
      GlobalWin.mainWin.webContents.send(
        'google-api-translate-callback-event',
        R.okT(GoogleChannel.commonErrorExpand(data))
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
      log.info('[Google翻译校验密钥事件] - 响应报文 : ', JSON.stringify(data))
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.GOOGLE,
        R.okD(responseData)
      )
    } else {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.GOOGLE,
        R.errorMD(GoogleChannel.commonErrorExpand(data), responseData)
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
    if (msg.indexOf('API key not valid. Please pass a valid API key') !== -1) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    } else if (msg.indexOf('The request is missing a valid API key') !== -1) {
      msg = '请求未传递API密钥 , 请检查后再试 , 如重复出现请联系开发者'
    }
    return msg
  }
}

export default GoogleChannel
