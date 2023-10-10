import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import { OpenAIStatusEnum } from '../../../common/enums/OpenAIStatusEnum'
import { EventStreamContentType, fetchEventSource } from '@fortaine/fetch-event-source'
import { isNotNull } from '../../../common/utils/validate'
import { cacheGet } from '../utils/cacheUtil'

class TTimeAIChannelRequest {
  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   */
  static openaiTranslate = async (info): Promise<void> => {
    window.api['agentApiTranslateCallback'](
      R.okD(
        new AgentTranslateCallbackVo(info, {
          code: OpenAIStatusEnum.START
        })
      )
    )
    let text = ''

    await fetchEventSource('https://ink.timerecord.cn/apis/translate/translateAi/stream', {
      method: 'POST',
      body: JSON.stringify({
        languageType: info.languageType,
        languageResultType: info.languageResultType,
        translateContent: info.translateContent
      }),
      headers: {
        'Content-Type': 'application/json',
        token: cacheGet('token')
      },
      async onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return // everything's good
        } else {
          window.api.logInfoEvent('[TTimeAI翻译事件] - error 连接失败 :', {
            status: response.status,
            statusText: response.statusText
          })
          window.api['agentApiTranslateCallback'](
            R.errorD(
              new AgentTranslateCallbackVo(info, {
                code: OpenAIStatusEnum.ERROR,
                error: '连接失败'
              })
            )
          )
        }
      },
      onmessage(msg) {
        const resStr = msg.data
        try {
          const res = JSON.parse(resStr)
          if (res.status !== 200) {
            text += res.msg
            window.api['agentApiTranslateCallback'](
              R.okD(
                new AgentTranslateCallbackVo(info, {
                  code: OpenAIStatusEnum.ING,
                  content: text
                })
              )
            )
            return
          }
          const data = res.data
          // console.log('data : ', data)
          const content = data?.content
          if (isNotNull(content)) {
            text += content
            window.api['agentApiTranslateCallback'](
              R.okD(
                new AgentTranslateCallbackVo(info, {
                  code: OpenAIStatusEnum.ING,
                  content: content
                })
              )
            )
          }
        } catch (e) {
          window.api.logErrorEvent('[TTimeAI翻译事件] - parse error : ', text, msg)
        }
      },
      onclose() {
        window.api['agentApiTranslateCallback'](
          R.okD(
            new AgentTranslateCallbackVo(info, {
              code: OpenAIStatusEnum.END
            })
          )
        )
        window.api.logInfoEvent('[TTimeAI翻译事件] - 响应报文 : ', text)
      },
      onerror(err) {
        window.api.logInfoEvent('[TTimeAI翻译事件] - error {}', err)
        window.api['agentApiTranslateCallback'](
          R.errorD(
            new AgentTranslateCallbackVo(info, {
              code: OpenAIStatusEnum.ERROR,
              error: err
            })
          )
        )
        throw err
      }
    })
  }
}

export { TTimeAIChannelRequest }
