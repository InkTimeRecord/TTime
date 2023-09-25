import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import { OpenAIStatusEnum } from '../../../common/enums/OpenAIStatusEnum'
import { EventStreamContentType, fetchEventSource } from '@fortaine/fetch-event-source'

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
    let finished = false

    await fetchEventSource('',
      {
        method: 'POST',
        body: JSON.stringify({
          languageType: info.languageType,
          languageResultType: info.languageResultType,
          translateContent: info.translateContent
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        async onopen(response) {
          if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
            return // everything's good
          } else {
            window.api.logInfoEvent('[TTimeAI翻译事件] - error 连接失败')
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
          let resStr = msg.data
          console.log('data : ', resStr)
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
            if (data === '[DONE]' || finished) {
              return
            }
            const json = JSON.parse(data)
            const finishReason = json.finish_reason
            const choices = json.choices[0]
            const delta = choices.delta
            if (delta.hasOwnProperty('content') && delta.content) {
              delta.content
              let content = delta.content
              text += delta.content
              window.api['agentApiTranslateCallback'](
                R.okD(
                  new AgentTranslateCallbackVo(info, {
                    code: OpenAIStatusEnum.ING,
                    content: content
                  })
                )
              )

            } else if (finishReason === 'function_call' || finishReason === 'stop') {
              return
            }
          } catch (e) {
            console.error('[Request] parse error', text, msg)
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
