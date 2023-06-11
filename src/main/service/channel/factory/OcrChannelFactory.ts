import BaiduOcrChannel from '../product/ocr/BaiduOcrChannel'
import '../product/translate/AgentChannel'
import * as fs from 'fs'
import * as path from 'path'
import OcrServiceEnum from '../../../enums/OcrServiceEnum'
import TTimeOnlineOcrChannel from '../product/ocr/TTimeOnlineOcrChannel'
import VolcanoOcrChannel from '../product/ocr/VolcanoOcrChannel'

const baiduOcrChannel = new BaiduOcrChannel()
const ttimeOnlineOcrChannel = new TTimeOnlineOcrChannel()
const volcanoOcrChannel = new VolcanoOcrChannel()

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
    if (OcrServiceEnum.BAIDU === type) {
      baiduOcrChannel.apiOcr(info)
    } else if (OcrServiceEnum.TTIME_ONLINE === type) {
      ttimeOnlineOcrChannel.apiOcr(info)
    } else if (OcrServiceEnum.VOLCANO === type) {
      volcanoOcrChannel.apiOcr(info)
    }
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
    if (OcrServiceEnum.BAIDU === type) {
      baiduOcrChannel.apiOcrCheck(info)
    } else if (OcrServiceEnum.VOLCANO === type) {
      volcanoOcrChannel.apiOcrCheck(info)
    }
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
