import IOcrInterface from './IOcrInterface'
import TTimeRequest from '../../interfaces/TTimeRequest'
import GlobalWin from '../../../GlobalWin'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import { YesNoEnum } from '../../../../../common/enums/YesNoEnum'

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
        if (res['status'] != 200) {
          GlobalWin.ocrUpdateContent(YesNoEnum.N, res['msg'])
          return
        }
        let data = ''
        const textList = res['data']['ocrTextList']
        textList.forEach((text) => {
          data += text['text'] + '\n'
        })
        GlobalWin.ocrUpdateContent(YesNoEnum.Y, data)
      })
      .catch((err) => {
        log.error('[TTime在线Ocr事件] - 异常 : ', err)
      })
  }

  /**
   * Ocr校验
   */
  async apiOcrCheck(_info): Promise<void> {}
}

export default TTimeOnlineOcrChannel
