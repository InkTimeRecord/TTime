import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import { commonError } from '../utils/RequestUtil'
import md5 from 'md5'
import OcrServiceEnum from '../../../common/enums/OcrServiceEnum'

class BaiduChannelRequest {
  /**
   * OCR图片翻译
   *
   * @param info OCR信息
   */
  static apiOcrImg = (info): void => {
    const image = info.img.replace('data:image/png;base64,', '')
    const cuid = 'APICUID'
    const mac = 'mac'
    const salt = new Date().getTime()
    // 解码Base64字符串为一个二进制数组
    const binaryString = atob(image)
    // 创建一个Uint8Array并将二进制数据复制到其中
    const buffer = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i)
    }
    const sign = md5(info.appId + md5(buffer) + salt + cuid + mac + info.appKey)
    request({
      baseURL: 'https://fanyi-api.baidu.com/',
      url: 'api/trans/sdk/picture',
      method: HttpMethodType.POST,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        image: buffer,
        from: info.languageType,
        to: 'en',
        appid: info.appId,
        salt: salt,
        cuid: cuid,
        mac: mac,
        version: 3,
        paste: 0,
        sign: sign
      }
    }).then(
      (data) => {
        window.api['agentApiOcrCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
      },
      (err) => {
        window.api['agentApiOcrCallback'](
          R.errorD(new AgentTranslateCallbackVo(info, commonError(OcrServiceEnum.BAIDU_IMAGE, err)))
        )
      }
    )
  }
}

export { BaiduChannelRequest }
