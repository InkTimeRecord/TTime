import ITranslateInterface from './ITranslateInterface'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import log from '../../../../utils/log'
import R from '../../../../class/R'
import TranslateVo from '../../../../class/TranslateVo'
import { isNotNull } from '../../../../utils/validate'

class GoogleBuiltInChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    GlobalWin.mainWinSend('agent-api-translate', TranslateServiceEnum.GOOGLE_BUILT_IN, info, false)
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
      const explainsList = data?.[1]?.[0]?.[2]
      const explains: Array<string> = []
      if (isNotNull(explainsList)) {
        explainsList.forEach((data) => {
          explains.push(data?.[0] + '：' + data?.[1].join('；'))
        })
      }
      const dataList = data[0]
      let text = ''
      dataList.forEach((textArray) => {
        text += textArray[0]
      })
      const vo = new TranslateVo([text])
      vo.dictBuild('', '', '', '', explains, [])
      GlobalWin.mainWinSend('googlebuiltin-api-translate-callback-event', R.okD(vo))
    } else {
      GlobalWin.mainWinSend('googlebuiltin-api-translate-callback-event', R.okT(data))
    }
  }

  apiTranslateCheck(_info): void {}
}

export default GoogleBuiltInChannel
