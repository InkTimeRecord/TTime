import log from '../../../../utils/log'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TTimeRequest from '../../interfaces/TTimeRequest'
import { paramsFilter } from '../../../../utils/logExtend'

class TTimeChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[TTime翻译事件] - 请求报文 : ', paramsFilter(info))
    TTimeRequest.apiTranslate(info)
      .then((res) => {
        log.info('[TTime翻译事件] - 响应报文 : ', res)
        let data
        if (res['status'] !== 200) {
          data = res['msg']
        } else {
          data = res['data']['translateList']
        }
        GlobalWin.mainWin.webContents.send('ttime-api-translate-callback-event', R.okT(data))
      })
      .catch((error) => {
        GlobalWin.mainWin.webContents.send('ttime-api-translate-callback-event', R.okT(error))
      })
  }

  apiTranslateCheck(_info): void {}
}

export default TTimeChannel
