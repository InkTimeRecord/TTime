import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TTimeRequest from '../../interfaces/TTimeRequest'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class TTimeChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    TTimeRequest.apiTranslate(info)
      .then((res) => {
        log.info('[TTime翻译事件] - 响应报文 : ', res)
        let data
        if (res['status'] !== 200) {
          data = res['msg']
        } else {
          data = res['data']['translateList']
        }
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT(data))
      })
      .catch((error) => {
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT(error))
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheck(_info): void {}
}

export default TTimeChannel
