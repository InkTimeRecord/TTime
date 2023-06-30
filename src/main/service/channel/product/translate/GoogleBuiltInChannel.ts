import ITranslateAgentInterface from './ITranslateAgentInterface'
import GlobalWin from '../../../GlobalWin'
import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import TranslateVo from '../../../../../common/class/TranslateVo'
import { isNotNull } from '../../../../../common/utils/validate'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class GoogleBuiltInChannel extends TranslateAgent implements ITranslateAgentInterface {
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
      GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT(data))
      return
    }
    log.info('[Google翻译(内置)事件] - 响应报文 : ', JSON.stringify(data))
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
    GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okD(vo))
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheckCallback(_res): void {}
}

export default GoogleBuiltInChannel
