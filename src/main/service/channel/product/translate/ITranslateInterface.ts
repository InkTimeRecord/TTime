/**
 * 翻译接口
 */
interface ITranslateInterface {
  /**
   * 翻译
   */
  apiTranslate(info): void

  /**
   * 翻译校验
   */
  apiTranslateCheck(info): void
}

export default ITranslateInterface
