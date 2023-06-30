import R from '../../../../../common/class/R'

/**
 * 翻译代理接口
 */
interface ITranslateAgentInterface {
  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCallback(res: R): void

  /**
   * 翻译校验
   *
   * @param res 信息
   */
  apiTranslateCheckCallback(res: R): void
}

export default ITranslateAgentInterface
