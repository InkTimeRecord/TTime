import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import IOcrInterface from './IOcrInterface'
import VolcanoRequest from '../../interfaces/VolcanoRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { isNotNull, isNull } from '../../../../utils/validate'
import { YesNoEnum } from '../../../../enums/YesNoEnum'
import { VolcanoOcrModelEnum } from '../../../../enums/VolcanoOcrModelEnum'

class VolcanoOcrChannel implements IOcrInterface {
  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    log.info('[火山Ocr事件] - 请求报文 : ', paramsFilter(info))
    VolcanoRequest.apiOcr(info)
      .then((res) => {
        log.info('[火山Ocr事件] - 响应报文 : ', res)
        // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData 很奇怪的操作 这里兼容处理
        const errorInfo = (res['ResponseMetadata'] || res['ResponseMetaData'])?.Error
        if (isNotNull(errorInfo)) {
          GlobalWin.ocrUpdateContent(YesNoEnum.N, this.getMsgByErrorCode(errorInfo))
          return
        }
        const code = res['code']
        if (code !== 10000) {
          if (code === 63001) {
            // 进入这里的方法一般是因为识别的图片文本为空
            // 火山识别的图片文本为空时候 不会返回空串 而是这个code码
            GlobalWin.ocrUpdateContent(YesNoEnum.Y, '')
            return
          }
          let errorMsg = this.getMsgByErrorCode(code)
          errorMsg = isNull(errorMsg) ? res['message'] : errorMsg
          GlobalWin.ocrUpdateContent(YesNoEnum.N, errorMsg)
          return
        }
        if (info.model === VolcanoOcrModelEnum.OCR_NORMAL) {
          GlobalWin.ocrUpdateContent(YesNoEnum.Y, res['data']?.['line_texts']?.join('\n'))
        } else if (info.model === VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR) {
          const textList = res['data']?.['ocr_infos']
          let data = ''
          textList.forEach((text) => {
            data += text['text'] + '\n'
          })
          GlobalWin.ocrUpdateContent(YesNoEnum.Y, data)
        }
      })
      .catch((_err) => {})
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  async apiOcrCheck(info): Promise<void> {
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey,
      model: info.model
    }
    log.info('[火山Ocr校验密钥事件] - 请求报文 : ', paramsFilter(info))
    VolcanoRequest.apiOcr(info).then(
      (res) => {
        log.info('[火山Ocr校验密钥事件] - 响应报文 : ', res)
        // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData 很奇怪的操作 这里兼容处理
        const errorInfo = (res['ResponseMetadata'] || res['ResponseMetaData'])?.Error
        if (isNotNull(errorInfo)) {
          GlobalWin.setWin.webContents.send(
            'api-check-ocr-callback-event',
            TranslateServiceEnum.VOLCANO,
            R.errorMD(this.getMsgByErrorCode(errorInfo), responseData)
          )
          return
        }
        const code = res['code']
        if (code !== 10000) {
          let errorMsg = this.getMsgByErrorCode(code)
          errorMsg = isNull(errorMsg) ? res['message'] : errorMsg
          GlobalWin.setWin.webContents.send(
            'api-check-ocr-callback-event',
            TranslateServiceEnum.VOLCANO,
            R.errorMD(errorMsg, responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          TranslateServiceEnum.VOLCANO,
          R.okD(responseData)
        )
      },
      (_err) => {}
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorCode 错误码
   */
  getMsgByErrorCode(errorCode): string {
    errorCode += ''
    let msg = ''
    if (errorCode === '100009' || errorCode === '100010') {
      msg = 'API密钥无效 , 请检查是否输入错误'
    } else if (errorCode === '50207') {
      msg = '图片解析错误: 没有获取到图片或解析失败'
    } else if (errorCode === '50200' || errorCode === '50201' || errorCode === '50204') {
      msg = '请求参数错误，如重复出现，请联系作者'
    } else if (errorCode === '50400') {
      msg = '权限校验失败，请检查是否已创建应用并开通服务'
    } else if (errorCode === '50429') {
      msg = '调用频率受限 , 请降低调用频率'
    }
    return msg
  }
}

export default VolcanoOcrChannel
