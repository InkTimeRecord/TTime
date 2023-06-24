import TranslateServiceEnum from '../../../../common/enums/TranslateServiceEnum'
import log from '../../../utils/log'
import { paramsFilter } from '../../../utils/logExtend'

// 获取所有翻译源模块
const channelModules = import.meta.glob('../product/translate/*.ts')
// 构建翻译源
Object.keys(channelModules).map(async (modulePath) => {
  // 过滤非翻译通道
  if (
    modulePath.endsWith('/ITranslateInterface.ts') ||
    modulePath.endsWith('/ITranslateAgentInterface.ts')
  ) {
    return
  }
  const module = (await channelModules[modulePath]()) as { default: new () => never }
  const Channel = module.default
  TranslateChannelFactory.channels[Channel.name] = new Channel()
})

/**
 * 选择渠道工厂
 */
class TranslateChannelFactory {
  /**
   * 翻译源
   */
  static channels = {}

  /**
   * 翻译
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static translate(type: TranslateServiceEnum, info): void {
    log.info(`[${type}翻译事件] - 请求报文 : `, paramsFilter(info))
    info.type = type
    TranslateChannelFactory.channels[type + 'Channel'].apiTranslate(info)
  }

  /**
   * 选择翻译校验
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static translateCheck(type: TranslateServiceEnum, info): void {
    log.info(`[${type}翻译校验密钥事件] - 请求报文 : `, paramsFilter(info))
    info.type = type
    info = {
      ...info,
      ...this.buildTranslateCheckRequestInfo()
    }
    TranslateChannelFactory.channels[type + 'Channel'].apiTranslateCheck(info)
  }

  /**
   * 构建翻译校验请求信息
   */
  static buildTranslateCheckRequestInfo = (): object => {
    return {
      channel: 0,
      translateContent: '1',
      languageType: 'auto',
      languageResultType: 'en'
    }
  }

  /**
   * 翻译回调方法名称
   *
   * @param type 翻译类型
   * @return 翻译回调名称
   */
  static callbackName = (type): string => {
    return type.toLowerCase() + '-api-translate-callback-event'
  }
}

export default TranslateChannelFactory
