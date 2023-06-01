import logo from '../assets/logo.png'
import tencentCloudLogo from '../assets/tencentCloudLogo.png'
import baiduLogo from '../assets/baiduLogo.png'
import aliyunLogo from '../assets/aliyunLogo.png'
import googleLogo from '../assets/googleLogo.png'
import openAILogo from '../assets/openAILogo.png'
import youdaoLogo from '../assets/youdaoLogo.png'
import deepLLogo from '../assets/deepLLogo.png'
import volcanoLogo from '../assets/volcanoLogo.png'
import bingLogo from '../assets/bingLogo.png'
import caiyunLogo from '../assets/caiyunLogo.png'
import niuTransLogo from '../assets/niuTransLogo.png'
import transmart from '../assets/transmart.png'

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
   * 彩云翻译
   */
  static CAI_YUN = 'CaiYun'

  /**
   * 腾讯交互翻译
   */
  static TRAN_SMART = 'TranSmart'

  /**
   * 翻译服务信息Map
   */
  static translateServiceMap = new Map()

  /**
   * 获取服务信息
   */
  static getServiceList(): Map<string, { name; type; logo }> {
    if (TranslateServiceEnum.translateServiceMap.size > 1) {
      return TranslateServiceEnum.translateServiceMap
    }
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.TTIME,
      TranslateServiceEnum.buildServiceInfo('TTime翻译', TranslateServiceEnum.TTIME, logo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.TENCENT_CLOUD,
      TranslateServiceEnum.buildServiceInfo(
        '腾讯翻译君',
        TranslateServiceEnum.TENCENT_CLOUD,
        tencentCloudLogo
      )
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.BAIDU,
      TranslateServiceEnum.buildServiceInfo('百度翻译', TranslateServiceEnum.BAIDU, baiduLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.ALIYUN,
      TranslateServiceEnum.buildServiceInfo('阿里云翻译', TranslateServiceEnum.ALIYUN, aliyunLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.GOOGLE,
      TranslateServiceEnum.buildServiceInfo('Google翻译', TranslateServiceEnum.GOOGLE, googleLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.GOOGLE_BUILT_IN,
      TranslateServiceEnum.buildServiceInfo(
        'Google翻译(内置)',
        TranslateServiceEnum.GOOGLE_BUILT_IN,
        googleLogo
      )
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.OPEN_AI,
      TranslateServiceEnum.buildServiceInfo('OpenAI翻译', TranslateServiceEnum.OPEN_AI, openAILogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.YOU_DAO,
      TranslateServiceEnum.buildServiceInfo('有道翻译', TranslateServiceEnum.YOU_DAO, youdaoLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.DEEP_L,
      TranslateServiceEnum.buildServiceInfo('DeepL翻译', TranslateServiceEnum.DEEP_L, deepLLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.DEEP_L_BUILT_IN,
      TranslateServiceEnum.buildServiceInfo(
        'DeepL翻译(内置)',
        TranslateServiceEnum.DEEP_L_BUILT_IN,
        deepLLogo
      )
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.VOLCANO,
      TranslateServiceEnum.buildServiceInfo('火山翻译', TranslateServiceEnum.VOLCANO, volcanoLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.BING,
      TranslateServiceEnum.buildServiceInfo('Bing翻译', TranslateServiceEnum.BING, bingLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.BING_DICT,
      TranslateServiceEnum.buildServiceInfo(
        'Bing词典翻译',
        TranslateServiceEnum.BING_DICT,
        bingLogo
      )
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.NIU_TRANS,
      TranslateServiceEnum.buildServiceInfo(
        '小牛翻译',
        TranslateServiceEnum.NIU_TRANS,
        niuTransLogo
      )
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.CAI_YUN,
      TranslateServiceEnum.buildServiceInfo('彩云翻译', TranslateServiceEnum.CAI_YUN, caiyunLogo)
    )
    TranslateServiceEnum.translateServiceMap.set(
      TranslateServiceEnum.TRAN_SMART,
      TranslateServiceEnum.buildServiceInfo(
        '腾讯交互翻译',
        TranslateServiceEnum.TRAN_SMART,
        transmart
      )
    )
    return TranslateServiceEnum.translateServiceMap
  }

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum): { name; type; logo } {
    return TranslateServiceEnum.translateServiceMap.get(serviceEnum)
  }

  /**
   * 构建服务信息对象
   *
   * @param name 服务名称
   * @param type 服务类型
   * @param logo 服务logo
   */
  static buildServiceInfo(name, type, logo): { name: string; type: string; logo: string } {
    return { name, type, logo }
  }
}

// 首次加载获取一下 用作数据初始化预加载
TranslateServiceEnum.getServiceList()

export { TranslateServiceEnum }
