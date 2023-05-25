/**
 * 翻译接口
 */
interface IOcrInterface {
  /**
   * Orc
   */
  apiOcr(info): void

  /**
   * Ocr校验
   */
  apiOcrCheck(info): void
}

export default IOcrInterface
