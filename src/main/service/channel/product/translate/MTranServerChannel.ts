import MTranServerRequest from "../../interfaces/MTranServerRequest"
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import { isNull } from "../../../../../common/utils/validate"
import TranslateChannelFactory from "../../factory/TranslateChannelFactory"
import { commonError } from "../../../../utils/RequestUtil"
import R from "../../../../../common/class/R"
import TranslateServiceEnum from "../../../../../common/enums/TranslateServiceEnum"

class MTranServerChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    MTranServerRequest.apiTranslate(info)
      .then((res) => {
        log.info('[MTranServer] - 响应报文 : ', res)
        const text = res['result']
        if (isNull(text)) {
          GlobalWin.mainWinSend(
            TranslateChannelFactory.callbackName(info.type),
            R.okIT(info, '翻译出现错误')
          )
          return
        }
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, text))
      })
      .catch((err) => {
        commonError('MTranServer翻译事件', err)
        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okIT(info, err.message)
        )
      })
  }

  /**
    * 翻译校验
    *
    * @param info 翻译信息
    */
  apiTranslateCheck(info): void {
    MTranServerRequest.apiTranslate(info).then(
      (res) => {
        log.info('[MTranServer翻译校验密钥事件] - 响应报文 : ', res)
        const target = res['result']
        if (!target[0]) {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.MTRAN_SERVER,
            R.errorD(info.responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.MTRAN_SERVER,
          R.okD(info.responseData)
        )
      },
      (err) => {
        commonError('MTranServer翻译校验密钥', err)

        GlobalWin.mainWinSend(
          TranslateChannelFactory.callbackName(info.type),
          R.okIT(info, err.message)
        )
      }
    )
  }
}

export default MTranServerChannel