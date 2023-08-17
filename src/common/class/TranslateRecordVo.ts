/**
 * 翻译结果
 */
import TranslateServiceRecordVo from './TranslateServiceRecordVo'
import { random } from '../utils/strUtil'

class TranslateRecordVo {
  /**
   * 请求ID
   */
  requestId: string

  /**
   * 翻译内容
   */
  translateContent: string

  /**
   * 翻译语言类型
   */
  languageType: string

  /**
   * 翻译结果语言类型
   */
  languageResultType: string

  /**
   * 翻译结果内容
   */
  translateServiceRecordList: Array<TranslateServiceRecordVo>

  static build(info): TranslateRecordVo {
    const translateRecordVo = new TranslateRecordVo()
    translateRecordVo.requestId = random()
    translateRecordVo.translateContent = info.translateContentDealWith
    translateRecordVo.languageType = info.inputLanguage.languageName
    translateRecordVo.languageResultType = info.resultLanguage.languageName
    return translateRecordVo
  }
}

export default TranslateRecordVo
