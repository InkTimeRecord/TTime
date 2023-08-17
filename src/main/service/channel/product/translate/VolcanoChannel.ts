import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import R from '../../../../../common/class/R'
import VolcanoRequest from '../../interfaces/VolcanoRequest'
import { isNotNull } from '../../../../../common/utils/validate'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class VolcanoChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    VolcanoRequest.apiTranslate(info)
      .then((res) => {
        log.info('[火山翻译事件] - 响应报文 : ', res)
        // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData 很奇怪的操作 这里兼容处理
        const errorInfo = (res['ResponseMetadata'] || res['ResponseMetaData'])?.Error
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (isNotNull(errorInfo)) {
          GlobalWin.mainWinSend(
            TranslateChannelFactory.callbackName(info.type),
            R.okIT(info, this.getMsgByErrorCode(errorInfo))
          )
          return
        }
        const translationList = res['TranslationList'][0]['Translation']
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okIT(info, translationList)
        )
      })
      .catch((error) => {
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, error))
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    // 此翻译不支持输入文字自动识别语言 这里默认识别中文
    info.languageType = 'zh'
    VolcanoRequest.apiTranslate(info).then(
      (res) => {
        log.info('[火山翻译校验密钥事件] - 响应报文 : ', res)
        // 火山接口报错时，接口参数时而为 ResponseMetadata 时而为 ResponseMetaData 很奇怪的操作 这里兼容处理
        const errorInfo = (res['ResponseMetadata'] || res['ResponseMetaData'])?.Error
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (isNotNull(errorInfo)) {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.VOLCANO,
            R.errorMD(this.getMsgByErrorCode(errorInfo), info.responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.VOLCANO,
          R.okD(info.responseData)
        )
      },
      (err) => {
        log.error('[火山翻译校验密钥事件] - 异常响应报文 : ', err)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.VOLCANO,
          R.errorD(info.responseData)
        )
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorInfo 错误信息
   */
  getMsgByErrorCode(errorInfo): string {
    let errorCode = errorInfo.CodeN || errorInfo.Code
    errorCode += ''
    let msg = ''
    if (errorCode === '100009' || errorCode === '100010') {
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
