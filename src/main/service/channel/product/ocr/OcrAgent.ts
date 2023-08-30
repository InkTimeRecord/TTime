import IOcrInterface from './IOcrInterface'
import GlobalWin from '../../../GlobalWin'

/**
 * 翻译代理转发实现
 */
class OcrAgent implements IOcrInterface {
  /**
   * OCR
   *
   * @param info 翻译信息
   */
  apiOcr(info): void {
    info.isOcrCheckType = false
    GlobalWin.mainWinSend('agent-api-ocr', info)
  }

  /**
   * Ocr校验
   *
   * @param info 翻译信息
   */
  apiOcrCheck(info): void {
    info.isOcrCheckType = true
    GlobalWin.mainWinSend('agent-api-ocr', info)
  }
}

export default OcrAgent
