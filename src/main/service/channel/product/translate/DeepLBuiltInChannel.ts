import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../../common/class/R'
import TranslateVo from '../../../../../common/class/TranslateVo'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class DeepLBuiltInChannel extends TranslateAgent implements ITranslateAgentInterface {
  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCallback(res: R): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    if (res.code === R.ERROR) {
      GlobalWin.mainWinSend(
        TranslateChannelFactory.callbackName(info.type),
        R.okIT(info, this.getMsgByErrorMsg(data))
      )
      return
    }
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
    vo.requestId = info.requestId
    GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okD(vo))
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheckCallback(_res): void {}

  /**
   * 按错误代码获取消息
   *
   * @param errorMsg 错误信息
   */
  getMsgByErrorMsg(errorMsg): string {
    if (errorMsg === 'Too many requests') {
      errorMsg = '查询频率受限，请稍后再试'
    }
    return errorMsg
  }
}

export default DeepLBuiltInChannel
