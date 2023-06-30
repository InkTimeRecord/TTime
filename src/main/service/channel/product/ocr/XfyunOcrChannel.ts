import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import IOcrInterface from './IOcrInterface'
import XfyunRequest from '../../interfaces/XfyunRequest'
import OcrServiceEnum from '../../../../../common/enums/OcrServiceEnum'
import { commonError } from '../../../../utils/RequestUtil'
import { YesNoEnum } from '../../../../../common/enums/YesNoEnum'

class XfyunOcrChannel implements IOcrInterface {
  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    XfyunRequest.apiOcr(info)
      .then((res) => {
        log.info('[讯飞Ocr事件] - 响应报文 : ', res)
        if (res['header']['code'] !== 0) {
          GlobalWin.ocrUpdateContent(YesNoEnum.N, this.getMsgByErrorCode(res))
          return
        }
        const textJson = res?.['payload']?.['result']?.['text']
        const decodedText = JSON.parse(Buffer.from(textJson, 'base64').toString('utf-8'))
        const { pages } = decodedText
        const content = pages.flatMap((page) => {
          const { lines } = page
          if (!lines) {
            return []
          }
          return lines.flatMap((line) => {
            const { words } = line
            if (!words) {
              return []
            }
            return words.map((word) => word?.content).filter((contentTemp) => contentTemp !== null)
          })
        })
        GlobalWin.ocrUpdateContent(YesNoEnum.Y, content.join('\n') + '\n')
      })
      .catch((err) => {
        GlobalWin.ocrUpdateContent(
          YesNoEnum.N,
          this.getMsgByErrorCode(this.getMsgByErrorCode(commonError('讯飞Ocr', err)))
        )
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  async apiOcrCheck(info): Promise<void> {
    XfyunRequest.apiOcr(info)
      .then((res) => {
        log.info('[讯飞Ocr校验密钥事件] - 响应报文 : ', res)
        if (res['header']['code'] !== 0) {
          GlobalWin.setWin.webContents.send(
            'api-check-ocr-callback-event',
            OcrServiceEnum.XFYUN,
            R.errorMD(this.getMsgByErrorCode(res), info.responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.XFYUN,
          R.okD(info.responseData)
        )
      })
      .catch((err) => {
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.XFYUN,
          R.errorMD(this.getMsgByErrorCode(commonError('讯飞Ocr校验密钥', err)), info.responseData)
        )
      })
  }

  /**
   * 按错误信息获取消息
   *
   * @param error 错误信息
   */
  getMsgByErrorCode(error): string {
    error = error?.message || error?.header?.message || JSON.stringify(error)
    let msg = ''
    if (
      error.indexOf('app_id and api_key does not match') != -1 ||
      error.indexOf('HMAC signature does not match') != -1 ||
      error.indexOf('HMAC signature cannot be verified: fail to retrieve credential') != -1
    ) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    }
    return msg
  }
}

export default XfyunOcrChannel
