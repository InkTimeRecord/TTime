import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import IOcrInterface from './IOcrInterface'
import { isNull } from '../../../../../common/utils/validate'
import { YesNoEnum } from '../../../../../common/enums/YesNoEnum'
import OcrServiceEnum from '../../../../../common/enums/OcrServiceEnum'
import OcrSpaceRequest from '../../interfaces/OcrSpaceRequest'
import { commonError } from '../../../../utils/RequestUtil'

class OcrSpaceOcrChannel implements IOcrInterface {
  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    OcrSpaceRequest.apiOcr(info).then(
      (res) => {
        log.info('[OcrSpace事件] - 响应报文 : ', res)
        if (isNull(res['ParsedResults'])) {
          let errorMsg = res['ErrorMessage']?.[0]
          errorMsg = isNull(errorMsg) ? res['SearchablePDFURL'] : errorMsg
          GlobalWin.ocrUpdateContent(YesNoEnum.N, this.getMsgByErrorMsg(errorMsg))
          return
        }
        const text = res['ParsedResults'].map((content) => content['ParsedText']).join('')
        GlobalWin.ocrUpdateContent(YesNoEnum.Y, text)
      },
      (err) => {
        GlobalWin.ocrUpdateContent(YesNoEnum.N, this.getMsgByErrorMsg(err))
      }
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  async apiOcrCheck(info): Promise<void> {
    // 因为图片是英文的 设置其他语言此文本识别源可能会失败
    info.language = 'eng'
    OcrSpaceRequest.apiOcr(info).then(
      (res) => {
        log.info('[OcrSpace校验密钥事件] - 响应报文 : ', res)
        if (isNull(res['ParsedResults'])) {
          let errorMsg = res['ErrorMessage']?.[0]
          errorMsg = isNull(errorMsg) ? res['SearchablePDFURL'] : errorMsg
          GlobalWin.setWin.webContents.send(
            'api-check-ocr-callback-event',
            OcrServiceEnum.OCR_SPACE,
            R.errorMD(this.getMsgByErrorMsg(errorMsg), info.responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.OCR_SPACE,
          R.okD(info.responseData)
        )
      },
      (err) => {
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.OCR_SPACE,
          R.errorMD(this.getMsgByErrorMsg(commonError('OcrSpace校验密钥', err)), info.responseData)
        )
      }
    )
  }

  /**
   * 按错误消息获取消息
   *
   * @param errorMsg 错误消息
   */
  getMsgByErrorMsg(errorMsg): string {
    if (
      errorMsg === 'API Key is not specified. Please provide a valid API key.' ||
      errorMsg === 'The API key is invalid'
    ) {
      errorMsg = 'API密钥无效 , 请检查是否输入错误'
    } else if (
      errorMsg === 'Unable to recognize the file type' ||
      errorMsg === 'Searchable PDF not generated as it was not requested.'
    ) {
      errorMsg = '图片解析错误: 没有获取到图片或解析失败'
    } else if (errorMsg.indexOf("E201: Value for parameter 'language' is invalid") != -1) {
      errorMsg = '验证失败，不支持当前语言'
    }
    return errorMsg
  }
}

export default OcrSpaceOcrChannel
