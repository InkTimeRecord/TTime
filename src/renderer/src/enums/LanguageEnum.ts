/**
 * 语言类型
 */
class LanguageEnum {
  static languageMap = new Map([
    ['cmn', { languageType: 'zh' }],
    ['eng', { languageType: 'en' }]
  ])
  static languageOpenAIMap = new Map([
    ['cmn', { languageType: '中文(简体)' }],
    ['eng', { languageType: 'English' }],
    ['jpn', { languageType: 'Japanese' }],
    ['rus', { languageType: 'Русский' }],
    ['kor', { languageType: 'Korean' }]
  ])
  static languageVolcanoMap = new Map([
    ['cmn', { languageType: 'zh' }],
    ['eng', { languageType: 'en' }],
    ['jpn', { languageType: 'ja' }],
    ['rus', { languageType: 'ru' }],
    ['kor', { languageType: 'ko' }]
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
   * 未知的
   */
  static NO = 'und'
}

export default LanguageEnum
