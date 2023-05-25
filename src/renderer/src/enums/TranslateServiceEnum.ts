import logo from '../assets/logo.png'
import tencentCloudLogo from '../assets/tencentCloudLogo.png'
import baiduLogo from '../assets/baiduLogo.png'
import aliyunLogo from '../assets/aliyunLogo.png'
import googleLogo from '../assets/googleLogo.png'
import openAILogo from '../assets/openAILogo.png'
import youdaoLogo from '../assets/youdaoLogo.png'
import deepLLogo from '../assets/deepLLogo.png'
import volcanoLogo from '../assets/volcanoLogo.png'

/**
 * 翻译服务枚举
 */
class TranslateServiceEnum {
  /**
   * TTime翻译
   */
  static TTIME = 'TTime'

  /**
   * 腾讯云翻译 - 腾讯翻译君
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
   * Google内置翻译
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
   * 火山翻译
   */
  static VOLCANO = 'Volcano'

  /**
   * Bing翻译
   */
  static BING = 'Bing'

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum): { name, type, logo } {
    if (TranslateServiceEnum.TTIME === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('TTime翻译', serviceEnum, logo)
    } else if (TranslateServiceEnum.TENCENT_CLOUD === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('腾讯翻译君', serviceEnum, tencentCloudLogo)
    } else if (TranslateServiceEnum.BAIDU === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('百度翻译', serviceEnum, baiduLogo)
    } else if (TranslateServiceEnum.ALIYUN === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('阿里云翻译', serviceEnum, aliyunLogo)
    } else if (TranslateServiceEnum.GOOGLE === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('Google翻译', serviceEnum, googleLogo)
    } else if (TranslateServiceEnum.GOOGLE_BUILT_IN === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('Google内置翻译', serviceEnum, googleLogo)
    } else if (TranslateServiceEnum.OPEN_AI === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('OpenAI翻译', serviceEnum, openAILogo)
    } else if (TranslateServiceEnum.YOU_DAO === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('有道翻译', serviceEnum, youdaoLogo)
    } else if (TranslateServiceEnum.DEEP_L === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('DeepL翻译', serviceEnum, deepLLogo)
    } else if (TranslateServiceEnum.VOLCANO === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('火山翻译', serviceEnum, volcanoLogo)
    } else if (TranslateServiceEnum.BING === serviceEnum) {
      return TranslateServiceEnum.buildServiceInfo('Bing翻译', serviceEnum, volcanoLogo)
    }
    return TranslateServiceEnum.buildServiceInfo('', '', '')
  }

  /**
   * 构建服务信息对象
   *
   * @param name 服务名称
   * @param type 服务类型
   * @param logo 服务logo
   */
  static buildServiceInfo(name, type, logo) {
    return { name, type, logo }
  }

}

export { TranslateServiceEnum }
