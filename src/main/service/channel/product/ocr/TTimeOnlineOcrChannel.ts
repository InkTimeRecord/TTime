import IOcrInterface from './IOcrInterface'
import TTimeRequest from '../../interfaces/TTimeRequest'
import GlobalWin from '../../../GlobalWin'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'

class TTimeOnlineOcrChannel implements IOcrInterface {
  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    log.info('[TTime在线Ocr事件] - 请求报文 : ', paramsFilter(info))
    TTimeRequest.apiOcr(info)
      .then((res) => {
        log.info('[TTime在线Ocr事件] - 响应报文 : ', JSON.stringify(res))
        let data = ''
        const textList = res['data']['ocrTextList']
        textList.forEach((text) => {
          data += text['text'] + '\n'
        })
        GlobalWin.mainWinSendOcrTranslated(data)
      })
      .catch((_err) => {
        log.error('[TTime在线Ocr事件] - 异常 : ', _err)
      })
  }

  /**
   * Ocr校验
   */
  async apiOcrCheck(_info): Promise<void> {}
}

export default TTimeOnlineOcrChannel
