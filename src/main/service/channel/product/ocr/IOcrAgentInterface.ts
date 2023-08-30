import R from '../../../../../common/class/R'

/**
 * OCR代理接口
 */
interface IOcrAgentInterface {
  /**
   * 翻译
   *
   * @param res 信息
   */
  apiOcrCallback(res: R): void

  /**
   * 翻译校验
   *
   * @param res 信息
   */
  apiOcrCheckCallback(res: R): void
}

export default IOcrAgentInterface
