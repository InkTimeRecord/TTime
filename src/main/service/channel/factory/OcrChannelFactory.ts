import * as fs from 'fs'
import * as path from 'path'
import { isNotNull } from '../../../../common/utils/validate'
import log from '../../../utils/log'
import { paramsFilter } from '../../../utils/logExtend'

// 获取所有OCR源模块
const channelModules = import.meta.glob('../product/ocr/*.ts')
const channels = {}
// 构建翻译源
Object.keys(channelModules).map(async (modulePath) => {
  // 过滤非OCR通道
  if (modulePath.endsWith('/IOcrInterface.ts')) {
    return
  }
  const module = (await channelModules[modulePath]()) as { default: new () => never }
  const Channel = module.default
  channels[Channel.name] = new Channel()
})

// 获取所有翻译源配置信息 此处是异步加载 所以直接写在这里了 没有构建在方法 / 类中
const channelConfigModules = import.meta.glob('../../../../common/channel/ocr/info/*.ts')
Object.keys(channelConfigModules).map(async (modulePath) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moduleName = modulePath.split('/').pop().split('.')[0]
  const channelCode = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace('Info', '')
  const module = (await channelConfigModules[modulePath]()) as { default }
  OcrChannelFactory.channelConfigs[channelCode] = module.default
})

/**
 * 选择渠道工厂
 */
class OcrChannelFactory {
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
  static ocr(type, info): void {
    log.info(
      `[${OcrChannelFactory.channelConfigs[type].name}事件] - 请求报文 : `,
      paramsFilter(info)
    )
    channels[type + 'OcrChannel'].apiOcr(info)
  }

  /**
   * 选择翻译校验
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static ocrCheck(type, info): void {
    log.info(
      `[${OcrChannelFactory.channelConfigs[type].name}校验密钥事件] - 请求报文 : `,
      paramsFilter(info)
    )
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    // 每个服务可能会有其他附带值 根据配置动态加载
    // 例如：火山 会有模型选择
    const defaultInfo = OcrChannelFactory.channelConfigs[type]?.defaultInfo
    if (isNotNull(defaultInfo)) {
      Object.keys(defaultInfo).forEach((key) => {
        responseData[key] = info[key]
      })
    }
    info = {
      ...info,
      ...this.buildOcrCheckRequestInfo(),
      responseData
    }
    channels[type + 'OcrChannel'].apiOcrCheck(info)
  }

  /**
   * 构建翻译校验请求信息
   */
  static buildOcrCheckRequestInfo = (): { img } => {
    return {
      img:
        'data:image/png;base64,' +
        Buffer.from(fs.readFileSync(path.join(__dirname, '../../ocr/ocrCheck.png'))).toString(
          'base64'
        )
    }
  }
}

export default OcrChannelFactory
