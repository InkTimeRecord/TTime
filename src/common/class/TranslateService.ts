import { random } from '../utils/strUtil'
import { isNull } from '../utils/validate'

/**
 * 翻译源信息
 */
class TranslateService {
  /**
   * ID
   */
  id: string

  /**
   * 翻译源类型
   */
  type: string

  /**
   * 使用状态
   */
  useStatus: boolean

  /**
   * 是否内置
   */
  isBuiltIn: boolean

  /**
   * 应用ID
   */
  appId: string

  /**
   * 应用秘钥
   */
  appKey: string

  /**
   * 验证状态
   */
  checkStatus: boolean

  static buildIsBuiltInService = (info): object => {
    if (isNull(info)) {
      info = {}
    }
    const translateService = new TranslateService()
    translateService.id = random()
    translateService.useStatus = true
    translateService.isBuiltIn = true
    translateService.checkStatus = true
    return {
      ...translateService,
      ...info
    }
  }

  static buildKeyService = (info): object => {
    if (isNull(info)) {
      info = {}
    }
    const translateService = new TranslateService()
    translateService.id = random()
    translateService.useStatus = false
    translateService.isBuiltIn = false
    translateService.appId = ''
    translateService.appKey = ''
    translateService.checkStatus = false
    return {
      ...translateService,
      ...info
    }
  }
}

export default TranslateService
