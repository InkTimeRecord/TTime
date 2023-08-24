import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import IOcrInterface from './IOcrInterface'
import TencentCloudRequest from '../../interfaces/TencentCloudRequest'
import { YesNoEnum } from '../../../../../common/enums/YesNoEnum'
import OcrServiceEnum from '../../../../../common/enums/OcrServiceEnum'

class TencentCloudImageOcrChannel implements IOcrInterface {
  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    TencentCloudRequest.apiOcrTranslate(info).then(
      (res) => {
        log.info('[腾讯云图片翻译OCR事件] - 响应报文 : ', res)
        const text = res?.ImageRecord?.Value?.map((detection) => detection.SourceText).join('\n')
        GlobalWin.ocrUpdateContent(YesNoEnum.Y, text)
      },
      (err) => {
        log.error('[腾讯云图片翻译OCR事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('which exceeds the frequency limit') !== -1) {
          msg = '查询过于频繁 , 请重试'
        } else {
          msg = '未知错误 , 如重复出现 , 请联系开发者'
        }
        GlobalWin.ocrUpdateContent(YesNoEnum.N, msg)
      }
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  async apiOcrCheck(info): Promise<void> {
    TencentCloudRequest.apiOcrTranslate(info).then(
      (res) => {
        log.info('[腾讯云图片翻译OCR校验密钥事件] - 响应报文 : ', res)
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.TENCENT_CLOUD_IMAGE,
          R.okD(info.responseData)
        )
      },
      (err) => {
        log.error('[腾讯云图片翻译OCR校验密钥事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('reason: read ECONNRESET') !== -1) {
          msg = '验证超时，如重复出现，请检查网络后再试'
        } else if (errMessage.indexOf('The SecretId is not found') !== -1) {
          msg = '请输入正确的 SecretId 后再试'
        } else if (errMessage.indexOf('The provided credentials could not be validated') !== -1) {
          msg = '输入的密钥信息不匹配，请检查后再试'
        } else {
          msg = '未知错误 , 如重复出现 , 请联系开发者'
        }
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          OcrServiceEnum.TENCENT_CLOUD_IMAGE,
          R.errorMD(msg, info.responseData)
        )
      }
    )
  }
}

export default TencentCloudImageOcrChannel
