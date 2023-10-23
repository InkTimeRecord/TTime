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
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, data))
      })
      .catch((error) => {
        log.error('[TTime翻译事件] - 异常报文 : ', error)
        const errCode = error.code
        const errMessage = error.message
        log.error('[TTime翻译事件] - 异常报文 : ', {
          errCode,
          errMessage
        })

        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, '翻译请求失败'))
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheck(_info): void {
  }
}

export default TTimeChannel
