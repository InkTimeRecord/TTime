import ITranslateInterface from './ITranslateInterface'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import log from '../../../../utils/log'
import R from '../../../../class/R'

class GoogleBuiltInChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.GOOGLE_BUILT_IN,
      info,
      false
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
      // 翻译模式
      for (const r of data[0]) {
        if (r[0]) {
          data = data + r[0]
        }
      }
      GlobalWin.mainWin.webContents.send('googlebuiltin-api-translate-callback-event', R.okT(data))
    } else {
      GlobalWin.mainWin.webContents.send('googlebuiltin-api-translate-callback-event', R.okT(data))
    }
  }

  apiTranslateCheck(_info): void {}
}

export default GoogleBuiltInChannel
