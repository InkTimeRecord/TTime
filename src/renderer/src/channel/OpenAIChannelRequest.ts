import { isNotNull, isNull } from '../utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { OpenAIStatusEnum } from '../enums/OpenAIStatusEnum'

class OpenAIChannelRequest {

  static buildOpenAIRequest(info, isCheckRequest): object {
    const list = ['zh', '中文(简体)', '中文(繁体)', '中文(文言文)', '中文(粤语)']
    const languageType = info.languageType
    const languageResultType = info.languageResultType
    // 翻译的语言
    const formChinese = list.indexOf(languageType) >= 0
    let systemPrompt = 'You are a translation engine that can only translate text and cannot interpret it.'
    let assistPrompt = `translate from ${languageType} to ${languageResultType}`
    if (formChinese) {
      systemPrompt = '我希望你能担任翻译角色，只需要翻译不需要解释。请严格按照下面格式给到翻译结果：<原始文本>'
      assistPrompt = '将以下文字翻译成' + info.languageResultType
      if (languageResultType === '中文(简体)') {
        assistPrompt = '翻译成中文简体'
      } else if (languageResultType === '中文(繁体)') {
        assistPrompt = '翻譯成中文繁體'
      } else if (languageResultType === '中文(粤语)') {
        assistPrompt = '翻译成中文粤语'
      } else if (languageResultType === '中文(文言文)') {
        assistPrompt = '翻译成中文文言文'
      }
    } else if (languageResultType === '文字润色') {
      systemPrompt = 'Revise the following sentences to make them more clear, concise, and coherent.'
      assistPrompt = '润色此段文本'
    } else if (languageResultType === '总结') {
      systemPrompt = 'You are a text summarizer, you can only summarize the text, don\'t interpret it.'
      assistPrompt = '用最简洁的语言使用中文总结此段文本'
    } else if (languageResultType === '分析') {
      systemPrompt = 'You are a translation engine and grammar analyzer.'
      assistPrompt = `请用中文翻译此段文本并解析原文中的语法`
    } else if (languageResultType === '解释代码') {
      systemPrompt = 'You are a code explanation engine, you can only explain the code, do not interpret or translate it. Also, please report any bugs you find in the code to the author of the code.'
      assistPrompt = '用最简洁的语言使用中文解释此段代码、正则表达式或脚本。如果内容不是代码，请返回错误提示。如果代码有明显的错误，请指出。'
    }
    return {
      model: info.model,
      // 控制随机性：随着 temperature 接近 0 ，重复提交的内容，返回的结果将变得具有确定性和重复性
      // 一个介于 0 和 1 之间的值 可以为0.1这样的小数
      // 每次提交相同的内容时 按照 0 - 1 的概率返回不同的答案
      // 我们这里默认为 0 ，重复提交相同的内容返回同样的结果
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: assistPrompt },
        { role: 'user', content: `${info.translateContent}` }
      ],
      stream: !isCheckRequest
    }
  }

  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   * @param isCheckRequest  是否校验翻译请求状态
   */
  static openaiTranslate = (info): void => {
    const isCheckRequest = false
    const data = OpenAIChannelRequest.buildOpenAIRequest(info, isCheckRequest)
    window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, { code: OpenAIStatusEnum.START }, isCheckRequest ? info : null)
    let text = ''
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${info.appKey}`
      }
    }).then(async (response) => {
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }
          const dataArray = value.split('data: ')
          dataArray.forEach((data) => {
            data = data.trim()
            if (isNull(data) || data === '[DONE]') {
              return
            }
            data = JSON.parse(data)
            if (isNotNull(data['error'])) {
              window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, {
                code: OpenAIStatusEnum.ERROR,
                error: data
              }, isCheckRequest ? info : null)
              return
            }
            const content = data['choices'][0]['delta']['content']
            if (isNull(content)) {
              return
            }
            text += content
            window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, {
              code: OpenAIStatusEnum.ING,
              content: content
            }, isCheckRequest ? info : null)
          })
        }
      } finally {
        reader.releaseLock()
      }
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, { code: OpenAIStatusEnum.END }, isCheckRequest ? info : null)
      window.api.logInfoEvent('[OpenAI翻译事件] - 响应报文 : ', text)
    }).catch(error => {
      window.api.logInfoEvent('[OpenAI翻译事件] - error : ', error)
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, {
        code: OpenAIStatusEnum.ERROR,
        error: error
      }, isCheckRequest ? info : null)
    })
  }

  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   */
  static openaiCheck = (info): void => {
    const isCheckRequest = true
    const data = OpenAIChannelRequest.buildOpenAIRequest(info, isCheckRequest)
    const requestInfo = {
      baseURL: 'https://api.openai.com',
      url: '/v1/chat/completions',
      method: HttpMethodType.POST,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + info.appKey
      }
    }
    request(requestInfo).then((data) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, true, data, isCheckRequest ? info : null)
    }, (err) => {
      window.api['agentApiTranslateCallback'](TranslateServiceEnum.OPEN_AI, false, commonError(TranslateServiceEnum.OPEN_AI, err), isCheckRequest ? info : null)
    })
  }

}

export { OpenAIChannelRequest }
