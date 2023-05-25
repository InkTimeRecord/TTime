import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import R from '../../../../class/R'
import VolcanoRequest from '../../interfaces/VolcanoRequest'
import { isNotNull } from '../../../../utils/validate'

class VolcanoChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[火山翻译事件] - 请求报文 : ', paramsFilter(info))
    VolcanoRequest.apiTranslate(info).then((res) => {
      log.info('[火山翻译事件] - 响应报文 : ', res)
      // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData
      // 很奇怪的操作 这里兼容处理
      const resCheck = res['ResponseMetadata'] || res['ResponseMetaData']
      const errorInfo = resCheck.Error
      if (isNotNull(errorInfo)) {
        // @ts-ignore isNotNull Checked
        GlobalWin.mainWin.webContents.send('volcano-api-translate-callback-event', R.okT(this.getMsgByErrorCode(errorInfo)))
        return
      }
      let translationList = res['TranslationList'][0]['Translation']
      GlobalWin.mainWin.webContents.send('volcano-api-translate-callback-event', R.okT(translationList))
    }).catch((error) => {
      GlobalWin.mainWin.webContents.send('volcano-api-translate-callback-event', R.okT(error))
    })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[火山翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    // 火山翻译不支持输入文字自动识别语言 这里默认识别中文
    info.languageType = 'zh'
    VolcanoRequest.apiTranslate(info).then((res) => {
        log.info('[火山翻译校验密钥事件] - 响应报文 : ', res)
        // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData
        // 很奇怪的操作 这里兼容处理
        const resCheck = res['ResponseMetadata'] || res['ResponseMetaData']
        const errorInfo = resCheck.Error
        if (isNotNull(errorInfo)) {
          // @ts-ignore isNotNull Checked
          GlobalWin.setWin.webContents.send('api-check-translate-callback-event', TranslateServiceEnum.VOLCANO, R.errorMD(this.getMsgByErrorCode(errorInfo), responseData))
          return
        }
        GlobalWin.setWin.webContents.send('api-check-translate-callback-event', TranslateServiceEnum.VOLCANO, R.okD(responseData))
      },
      (err) => {
        log.error('[火山翻译校验密钥事件] - 异常响应报文 : ', err)
        GlobalWin.setWin.webContents.send('api-check-translate-callback-event', TranslateServiceEnum.VOLCANO, R.errorD(responseData))
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorInfo 错误信息
   */
  getMsgByErrorCode(errorInfo): string {
    const errorCode = errorInfo.CodeN || errorInfo.Code
    let msg = ''
    if (errorCode === 100009 || errorCode === 100010) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    } else if (errorCode === '-400') {
      msg = '请检查请求参数是否正确，如重复出现请联系作者'
    } else if (errorCode === '-415') {
      msg = '不支持的语言类型'
    } else if (errorCode === '-429') {
      msg = '请求过于频繁'
    } else if (errorCode === '-500') {
      msg = '翻译服务内部错误，如重复出现请联系作者'
    }
    return msg
  }

}

export default VolcanoChannel
