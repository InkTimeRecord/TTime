import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../class/R'
import TranslateVo from '../../../../class/TranslateVo'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'

class GoogleBuiltInChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[DeepL(内置)翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWinSend('agent-api-translate', TranslateServiceEnum.DEEP_L_BUILT_IN, info, false)
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   */
  static apiTranslateCallback(status, data): void {
    if (status) {
      log.info('[DeepL(内置)翻译事件] - 响应报文 : ', JSON.stringify(data))
      const textInfo = data?.['result']?.texts[0]
      const text = textInfo.text
      const vo = new TranslateVo([text])
      vo.dictBuild(
        '',
        '',
        '',
        '',
        textInfo?.alternatives?.map((alternative) => alternative.text),
        []
      )
      GlobalWin.mainWinSend('deeplbuiltin-api-translate-callback-event', R.okD(vo))
    } else {
      GlobalWin.mainWinSend(
        'deeplbuiltin-api-translate-callback-event',
        R.okT(this.getMsgByErrorMsg(data))
      )
    }
  }

  apiTranslateCheck(_info): void {}

  /**
   * 按错误代码获取消息
   *
   * @param errorMsg 错误信息
   */
  static getMsgByErrorMsg(errorMsg): string {
    if (errorMsg === 'Too many requests') {
      errorMsg = '查询频率受限，请稍后再试'
    }
    return errorMsg
  }
}

export default GoogleBuiltInChannel
