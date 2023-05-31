import logo from '../assets/logo.png'
import baiduLogo from '../assets/baiduLogo.png'
import volcanoLogo from '../assets/volcanoLogo.png'

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
   * 火山翻译
   */
  static VOLCANO = 'Volcano'

  /**
   * OCR服务信息Map
   */
  static ocrServiceMap = new Map()

  static getServiceList(): Map<string, { name; type; logo }> {
    if (OcrServiceEnum.ocrServiceMap.size > 1) {
      return OcrServiceEnum.ocrServiceMap
    }
    OcrServiceEnum.ocrServiceMap.set(
      OcrServiceEnum.TTIME,
      OcrServiceEnum.buildServiceInfo('TTimeOCR', OcrServiceEnum.TTIME, logo)
    )
    OcrServiceEnum.ocrServiceMap.set(
      OcrServiceEnum.TTIME_ONLINE,
      OcrServiceEnum.buildServiceInfo('TTime在线OCR', OcrServiceEnum.TTIME_ONLINE, logo)
    )
    OcrServiceEnum.ocrServiceMap.set(
      OcrServiceEnum.BAIDU,
      OcrServiceEnum.buildServiceInfo('百度OCR', OcrServiceEnum.BAIDU, baiduLogo)
    )
    OcrServiceEnum.ocrServiceMap.set(
      OcrServiceEnum.VOLCANO,
      OcrServiceEnum.buildServiceInfo('火山OCR', OcrServiceEnum.VOLCANO, volcanoLogo)
    )
    return OcrServiceEnum.ocrServiceMap
  }

  /**
   * 获取服务信息
   *
   * @param serviceEnum 服务枚举
   */
  static getInfoByService(serviceEnum): { name; type; logo } {
    return OcrServiceEnum.ocrServiceMap.get(serviceEnum)
  }

  /**
   * 构建服务信息对象
   *
   * @param name 服务名称
   * @param type 服务类型
   * @param logo 服务logo
   */
  static buildServiceInfo(name, type, logo): { name; type; logo } {
    return { name, type, logo }
  }
}

// 首次加载获取一下 用作数据初始化预加载
OcrServiceEnum.getServiceList()

export { OcrServiceEnum }
