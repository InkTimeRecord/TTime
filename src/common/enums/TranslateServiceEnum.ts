/**
 * 翻译服务枚举
 */
class TranslateServiceEnum {
  /**
   * TTime翻译
   */
  static TTIME = 'TTime'

  /**
   * 腾讯翻译君
   */
  static TENCENT_CLOUD = 'TencentCloud'

  /**
   * 百度翻译
   */
  static BAIDU = 'Baidu'

  /**
   * 阿里云翻译
   */
  static ALIYUN = 'Aliyun'

  /**
   * Google翻译
   */
  static GOOGLE = 'Google'

  /**
   * Google翻译(内置)
   */
  static GOOGLE_BUILT_IN = 'GoogleBuiltIn'

  /**
   * OpenAI翻译
   */
  static OPEN_AI = 'OpenAI'

  /**
   * 有道翻译
   */
  static YOU_DAO = 'YouDao'

  /**
   * DeepL翻译
   */
  static DEEP_L = 'DeepL'

  /**
   * DeepL翻译(内置)
   */
  static DEEP_L_BUILT_IN = 'DeepLBuiltIn'

  /**
   * 火山翻译
   */
  static VOLCANO = 'Volcano'

  /**
   * Bing翻译
   */
  static BING = 'Bing'

  /**
   * Bing词典翻译
   */
  static BING_DICT = 'BingDict'

  /**
   * 小牛翻译
   */
  static NIU_TRANS = 'NiuTrans'

  /**
   * 小牛翻译(内置)
   */
  static NIU_TRANS_BUILT_IN = 'NiuTransBuiltIn'

  /**
   * 彩云翻译
   */
  static CAI_YUN = 'CaiYun'

  /**
   * 腾讯交互翻译(内置)
   */
  static TRAN_SMART = 'TranSmart'

  /**
   * Papago翻译
   */
  static PAPAGO = 'Papago'

  /**
   * 根据 code 获取翻译名称
   *
   * @param {string} code - 翻译服务的 code
   * @returns {string} - 翻译名称
   */
  static getName(code): string {
    switch (code) {
      case TranslateServiceEnum.TTIME:
        return 'TTime翻译'
      case TranslateServiceEnum.TENCENT_CLOUD:
        return '腾讯翻译君'
      case TranslateServiceEnum.BAIDU:
        return '百度翻译'
      case TranslateServiceEnum.ALIYUN:
        return '阿里云翻译'
      case TranslateServiceEnum.GOOGLE:
        return 'Google翻译'
      case TranslateServiceEnum.GOOGLE_BUILT_IN:
        return 'Google翻译(内置)'
      case TranslateServiceEnum.OPEN_AI:
        return 'OpenAI翻译'
      case TranslateServiceEnum.YOU_DAO:
        return '有道翻译'
      case TranslateServiceEnum.DEEP_L:
        return 'DeepL翻译'
      case TranslateServiceEnum.DEEP_L_BUILT_IN:
        return 'DeepL翻译(内置)'
      case TranslateServiceEnum.VOLCANO:
        return '火山翻译'
      case TranslateServiceEnum.BING:
        return 'Bing翻译'
      case TranslateServiceEnum.BING_DICT:
        return 'Bing词典翻译'
      case TranslateServiceEnum.NIU_TRANS:
        return '小牛翻译'
      case TranslateServiceEnum.NIU_TRANS_BUILT_IN:
        return '小牛翻译(内置)'
      case TranslateServiceEnum.CAI_YUN:
        return '彩云翻译'
      case TranslateServiceEnum.TRAN_SMART:
        return '腾讯交互翻译(内置)'
      case TranslateServiceEnum.PAPAGO:
        return 'Papago翻译'
      default:
        return ''
    }
  }
}

export default TranslateServiceEnum
