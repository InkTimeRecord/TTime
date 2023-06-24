import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import CaiYunRequest from '../../interfaces/CaiYunRequest'
import { commonError } from '../../../../utils/RequestUtil'
import { isNull } from '../../../../../common/utils/validate'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class CaiYunChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    CaiYunRequest.apiTranslate(info)
      .then((res) => {
        log.info('[彩云翻译事件] - 响应报文 : ', res)
        const target = res['target']
        const text = target[0]
        if (isNull(text)) {
          GlobalWin.mainWinSend(
            TranslateChannelFactory.callbackName(info.type),
            R.okT('翻译出现错误')
          )
          return
        }
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT(text))
      })
      .catch((err) => {
        const errInfo = commonError('彩云翻译事件', err)
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okT(this.getMsgByErrorCode(errInfo?.['message']))
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
    CaiYunRequest.apiTranslate(info).then(
      (res) => {
        log.info('[彩云翻译校验密钥事件] - 响应报文 : ', res)
        const target = res['target']
        if (!target[0]) {
          // const msg = this.getMsgByErrorCode(errorCode)
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.CAI_YUN,
            R.errorD(responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.CAI_YUN,
          R.okD(responseData)
        )
      },
      (err) => {
        const errInfo = commonError('彩云翻译校验密钥', err)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.CAI_YUN,
          R.errorMD(this.getMsgByErrorCode(errInfo?.['message']), responseData)
        )
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorCode 错误码
   */
  getMsgByErrorCode(errorCode): string {
    let msg = errorCode
    if (errorCode === 'Invalid token') {
      msg = '秘钥无效，请检查后再试'
    } else if (errorCode === 'Unsupported trans_type') {
      msg = '不支持的语言类型'
    }
    return msg
  }
}

export default CaiYunChannel
