import { random } from '../utils/strUtil'
import { isNull } from '../utils/validate'

/**
 * 服务信息
 */
class ServiceConfig {
  /**
   * ID
   */
  id: string

  /**
   * 服务类型
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
    const translateService = new ServiceConfig()
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
    const translateService = new ServiceConfig()
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

export default ServiceConfig
