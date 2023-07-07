import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import { isNotNull, isNull } from '../../../../../common/utils/validate'
import { OpenAIStatusEnum } from '../../../../../common/enums/OpenAIStatusEnum'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class OpenAIChannel extends TranslateAgent implements ITranslateAgentInterface {
  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCallback(res: R): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    const code = data.code
    // 错误状态处理
    if (OpenAIStatusEnum.ERROR === code) {
      const error = data.error
      // 如果error中带有error则表示为openai返回的异常
      if (isNotNull(error.error)) {
        const errorMsg = error.error.message
        OpenAIChannel.callbackEvent(info, OpenAIStatusEnum.END, this.commonErrorExpand(errorMsg))
        return
      }
      // 请求异常处理
      if (isNotNull(error)) {
        if ('Error: Failed to fetch'.indexOf(error) !== -1) {
          // 此处一般是代理不可用问题造成的
          OpenAIChannel.callbackEvent(
            info,
            OpenAIStatusEnum.END,
            '当前网络异常，请检查代理是否可用'
          )
          return
        }
        OpenAIChannel.callbackEvent(info, OpenAIStatusEnum.END, error)
        return
      }
      OpenAIChannel.callbackEvent(
        info,
        OpenAIStatusEnum.END,
        '发生未知错误，如重复出现请查看日志或联系作者解决'
      )
      return
    }
    // 开始或结束状态
    if (OpenAIStatusEnum.START === code || OpenAIStatusEnum.END === code) {
      OpenAIChannel.callbackEvent(info, code, '')
      return
    }
    const text = data.content
    if (isNull(text)) {
      return
    }
    // 正常回调结果
    OpenAIChannel.callbackEvent(info, OpenAIStatusEnum.ING, text)
    return
  }

  /**
   * 翻译回调
   *
   * @param info 请求报文
   * @param status 状态
   * @param msg 消息
   */
  static callbackEvent(info, status, msg): void {
    GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okCT(status, msg))
  }

  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCheckCallback(res): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    if (res.code === R.ERROR) {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.OPEN_AI,
        R.errorMD(this.commonErrorExpand(data), info.responseData)
      )
      return
    }
    log.info('[OpenAI翻译校验密钥事件] - 响应报文 : ', JSON.stringify(data))
    GlobalWin.setWin.webContents.send(
      'api-check-translate-callback-event',
      TranslateServiceEnum.OPEN_AI,
      R.okD(info.responseData)
    )
  }

  /**
   * 公共错误处理
   *
   * @param msg   错误消息
   * @return 错误响应内容
   */
  commonErrorExpand(msg): string {
    if (msg.indexOf('Incorrect API key provided') !== -1 || msg.indexOf('invalid_api_key') !== -1) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    } else if (msg.indexOf('requests per min. Limit') !== 1) {
      msg = '请求达到速度限制，请稍后再试'
    } else if (msg.indexOf('The server had an error while processing your request') !== -1) {
      msg = '服务器请求时出错，请重试'
    }
    return msg
  }
}

export default OpenAIChannel
