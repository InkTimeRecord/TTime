/**
 * 翻译结果
 */
import TranslateVo from './TranslateVo'

class TranslateServiceRecordVo {
  /**
   * 翻译服务类型
   */
  translateServiceType: string

  /**
   * 翻译服务Id
   */
  translateServiceId: string

  /**
   * 翻译状态
   */
  translateStatus: boolean

  /**
   * 翻译结果内容
   */
  translateVo: TranslateVo
}

export default TranslateServiceRecordVo
