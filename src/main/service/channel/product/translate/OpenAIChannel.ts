import log from '../../../../utils/log'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { paramsFilter } from '../../../../utils/logExtend'
import { isNotNull, isNull } from '../../../../utils/validate'
import { OpenAIStatusEnum } from '../../../../enums/OpenAIStatusEnum'

class OpenAIChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[OpenAI翻译事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.OPEN_AI,
      info,
      false
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[OpenAI翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    GlobalWin.mainWin.webContents.send(
      'agent-api-translate',
      TranslateServiceEnum.OPEN_AI,
      info,
      true
    )
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   */
  static apiTranslateCallback(status, data): void {
    if (!status) {
      OpenAIChannel.callbackEvent(OpenAIStatusEnum.END, OpenAIChannel.commonErrorExpand(data))
      return
    }
    const code = data.code
    // 错误状态处理
    if (OpenAIStatusEnum.ERROR === code) {
      const error = data.error
      // 如果error中带有error则表示为openai返回的异常
      if (isNotNull(error.error)) {
        const errorMsg = data['error'].message
        if ('The server had an error while processing your request'.indexOf(errorMsg) !== -1) {
          OpenAIChannel.callbackEvent(OpenAIStatusEnum.END, '服务器请求时出错，请重试')
          return
        } else {
          OpenAIChannel.callbackEvent(OpenAIStatusEnum.END, errorMsg)
          return
        }
      }
      // 请求异常处理
      if (isNotNull(error)) {
        if ('Error: Failed to fetch'.indexOf(error) !== -1) {
          // 此处一般是代理不可用问题造成的
          OpenAIChannel.callbackEvent(OpenAIStatusEnum.END, '当前网络异常，请检查代理是否可用')
          return
        }
        OpenAIChannel.callbackEvent(OpenAIStatusEnum.END, error)
        return
      }
      OpenAIChannel.callbackEvent(
        OpenAIStatusEnum.END,
        '发生未知错误，如重复出现请查看日志或联系作者解决'
      )
      return
    }
    // 开始或结束状态
    if (OpenAIStatusEnum.START === code || OpenAIStatusEnum.END === code) {
      OpenAIChannel.callbackEvent(code, '')
      return
    }
    const text = data.content
    if (isNull(text)) {
      return
    }
    // 正常回调结果
    OpenAIChannel.callbackEvent(OpenAIStatusEnum.ING, text)
    return
  }

  static callbackEvent(status, msg): void {
    GlobalWin.mainWin.webContents.send('openai-api-translate-callback-event', R.okCT(status, msg))
  }

  /**
   * 翻译
   *
   * @param status 状态
   * @param data   数据
   * @param info   数据
   */
  static apiTranslateCheckCallback(status, data, info): void {
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    if (status) {
      log.info('[OpenAI翻译校验密钥事件] - 响应报文 : ', JSON.stringify(data))
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.OPEN_AI,
        R.okD(responseData)
      )
    } else {
      GlobalWin.setWin.webContents.send(
        'api-check-translate-callback-event',
        TranslateServiceEnum.OPEN_AI,
        R.errorMD(this.commonErrorExpand(data), responseData)
      )
    }
  }

  /**
   * 公共错误处理
   *
   * @param msg   错误消息
   * @return 错误响应内容
   */
  static commonErrorExpand(msg): string {
    if (msg.indexOf('Incorrect API key provided') !== -1 || msg.indexOf('invalid_api_key') !== -1) {
      msg = 'API密钥无效 , 请检查是否输入错误'
    }
    return msg
  }
}

export default OpenAIChannel
