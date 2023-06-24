import * as fs from 'fs'
import * as path from 'path'
import OcrServiceEnum from '../../../../common/enums/OcrServiceEnum'

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

/**
 * 选择渠道工厂
 */
class OcrChannelFactory {
  /**
   * 翻译
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static ocr(type: OcrServiceEnum, info: object): void {
    channels[type + 'OcrChannel'].apiOcr(info)
  }

  /**
   * 选择翻译校验
   *
   * @param type 翻译服务类型
   * @param info 翻译信息
   */
  static ocrCheck(type: OcrServiceEnum, info: object): void {
    info = {
      ...info,
      ...this.buildOcrCheckRequestInfo()
    }
    channels[type + 'OcrChannel'].apiOcrCheck(info)
  }

  /**
   * 构建翻译校验请求信息
   */
  static buildOcrCheckRequestInfo = () => {
    return {
      img: Buffer.from(fs.readFileSync(path.join(__dirname, '../../ocr/ocrCheck.png'))).toString(
        'base64'
      )
    }
  }
}

export default OcrChannelFactory
