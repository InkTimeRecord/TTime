import logo from '../assets/logo.png'
import baiduLogo from '../assets/baiduLogo.png'

/**
 * 翻译服务枚举
 */
class OcrServiceEnum {
  /**
   * TTime翻译
   */
  static TTIME = 'TTime'

  /**
   * TTime在线
   */
  static TTIME_ONLINE = 'TTimeOnline'

  /**
   * 百度翻译
   */
  static BAIDU = 'Baidu'

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum): { name, type, logo } {
    if (OcrServiceEnum.TTIME === serviceEnum) {
      return OcrServiceEnum.buildServiceInfo('TTime Ocr', serviceEnum, logo)
    } else if (OcrServiceEnum.TTIME_ONLINE === serviceEnum) {
        return OcrServiceEnum.buildServiceInfo('TTime在线 Ocr', serviceEnum, logo)
    } else if (OcrServiceEnum.BAIDU === serviceEnum) {
      return OcrServiceEnum.buildServiceInfo('百度 Ocr', serviceEnum, baiduLogo)
    }
    return OcrServiceEnum.buildServiceInfo('', '', '')
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

export { OcrServiceEnum }
