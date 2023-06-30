import log from '../../../utils/log'
import { paramsFilter } from '../../../utils/logExtend'
import { isNotNull } from '../../../../common/utils/validate'

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

// 获取所有翻译源配置信息 此处是异步加载 所以直接写在这里了 没有构建在方法 / 类中
const channelConfigModules = import.meta.glob('../../../../common/channel/translate/info/*.ts')
Object.keys(channelConfigModules).map(async (modulePath) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moduleName = modulePath.split('/').pop().split('.')[0]
  const channelCode = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace('Info', '')
  const module = (await channelConfigModules[modulePath]()) as { default }
  TranslateChannelFactory.channelConfigs[channelCode] = module.default
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
   * 渠道配置信息
   */
  static channelConfigs = {}

  /**
   * 翻译
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static translate(type, info): void {
    log.info(
      `[${TranslateChannelFactory.channelConfigs[type].name}事件] - 请求报文 : `,
      paramsFilter(info)
    )
    info.type = type
    TranslateChannelFactory.channels[type + 'Channel'].apiTranslate(info)
  }

  /**
   * 选择翻译校验
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static translateCheck(type, info): void {
    log.info(
      `[${TranslateChannelFactory.channelConfigs[type].name}校验密钥事件] - 请求报文 : `,
      paramsFilter(info)
    )
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    // 每个服务可能会有其他附带值 根据配置动态加载
    // 例如：OpenAI 会有模型选择
    const defaultInfo = TranslateChannelFactory.channelConfigs[type]?.defaultInfo
    if (isNotNull(defaultInfo)) {
      Object.keys(defaultInfo).forEach((key) => {
        responseData[key] = info[key]
      })
    }
    info.type = type
    info = {
      ...info,
      ...this.buildTranslateCheckRequestInfo(),
      responseData
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
