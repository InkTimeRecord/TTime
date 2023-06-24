import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import PapagoRequest from '../../interfaces/PapagoRequest'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import { isNull } from '../../../../../common/utils/validate'
import { commonError } from '../../../../utils/RequestUtil'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class PapagoChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    PapagoRequest.apiTranslate(info)
      .then((res) => {
        log.info('[Papago翻译事件] - 响应报文 : ', res)
        const data = res['message']['result']['translatedText']
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okT(data.split('\\n'))
        )
      })
      .catch((err) => {
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okT(this.commonErrorExpand('Papago翻译事件', err))
        )
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    // 此翻译不支持输入文字自动识别语言 这里默认识别中文
    info.languageType = 'zh-CN'
    PapagoRequest.apiTranslate(info).then(
      (res) => {
        log.info('[Papago翻译校验密钥事件] - 响应报文 : ', res)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.PAPAGO,
          R.okD(responseData)
        )
      },
      (err) => {
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.PAPAGO,
          R.errorMD(this.commonErrorExpand('Papago翻译校验密钥', err), responseData)
        )
      }
    )
  }

  /**
   * 按错误信息获取消息
   *
   * @param title 日志标题
   * @param err 错误信息
   */
  commonErrorExpand(title, err): string {
    let errInfo = commonError(title, err)
    if (isNull(errInfo['errorCode'])) {
      errInfo = JSON.parse(errInfo['errResponseData'])
    }
    const errorCode = errInfo['errorCode']
    let msg = errInfo['errorMessage']
    if (errorCode === '024') {
      msg = '密钥无效 , 请检查是否输入错误'
    } else if (errorCode === 'N2MT02') {
      msg = '输入的语言不支持'
    } else if (errorCode === 'N2MT04') {
      msg = '译文语言不支持'
    } else if (errorCode === 'N2MT09') {
      msg = '翻译的语言不支持'
    }
    return msg
  }
}

export default PapagoChannel
