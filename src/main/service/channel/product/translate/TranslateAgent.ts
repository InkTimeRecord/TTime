import ITranslateInterface from './ITranslateInterface'
import GlobalWin from '../../../GlobalWin'

/**
 * 翻译代理转发实现
 */
class TranslateAgent implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    info.isTranslateCheckType = false
    GlobalWin.mainWinSend('agent-api-translate', info)
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    info.isTranslateCheckType = true
    GlobalWin.mainWinSend('agent-api-translate', info)
  }
}

export default TranslateAgent
