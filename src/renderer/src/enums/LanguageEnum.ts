/**
 * 语言类型
 */
class LanguageEnum {
  static languageConversionMap = new Map([
    ['cmn', { languageType: '中文(简体)' }],
    ['eng', { languageType: '英语' }],
    ['jpn', { languageType: '日语' }],
    ['rus', { languageType: '俄语' }],
    ['kor', { languageType: '韩语' }]
  ])
  /**
   * 自动识别
   */
  static AUTO = 'auto'

  /**
   * 中文
   */
  static CHINESE = 'cmn'

  /**
   * 英文
   */
  static ENGLISH = 'eng'

  /**
   * 日语
   */
  static JAPANESE = 'jpn'

  /**
   * 未知的
   */
  static NO = 'und'

  /**
   * 中文
   */
  static CHINESE_CONVERSION = '中文(简体)'

  /**
   * 英文
   */
  static ENGLISH_CONVERSION = '英语'
}

export default LanguageEnum
