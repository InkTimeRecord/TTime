import { isNotNull, isNull } from '../../../common/utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { OpenAIStatusEnum } from '../../../common/enums/OpenAIStatusEnum'
import { v4 as uuidv4 } from 'uuid'
import { OpenAIModelEnum } from '../../../common/enums/OpenAIModelEnum'
import { EventStreamContentType, fetchEventSource } from '@fortaine/fetch-event-source'

export class QuoteProcessor {
  private quote: string
  public quoteStart: string
  public quoteEnd: string
  private prevQuoteStartBuffer: string
  private prevQuoteEndBuffer: string

  constructor() {
    this.quote = uuidv4().replace(/-/g, '').slice(0, 4)
    this.quoteStart = `<${this.quote}>`
    this.quoteEnd = `</${this.quote}>`
    this.prevQuoteStartBuffer = ''
    this.prevQuoteEndBuffer = ''
  }

  public processText(text: string): string {
    const deltas = text.split('')
    const targetPieces = deltas.map((delta) => this.processTextDelta(delta))
    return targetPieces.join('')
  }

  private processTextDelta(textDelta: string): string {
    if (textDelta === '') {
      return ''
    }
    if (textDelta.trim() === this.quoteEnd) {
      return ''
    }
    let result = textDelta
    // process quote start
    let quoteStartBuffer = this.prevQuoteStartBuffer
    // console.debug('\n\n')
    // console.debug('---- process quote start -----')
    // console.debug('textDelta', textDelta)
    // console.debug('this.quoteStartbuffer', this.quoteStartBuffer)
    // console.debug('start loop:')
    let startIdx = 0
    for (let i = 0; i < textDelta.length; i++) {
      const char = textDelta[i]
      // console.debug(`---- i: ${i} startIdx: ${startIdx} ----`)
      // console.debug('char', char)
      // console.debug('quoteStartBuffer', quoteStartBuffer)
      // console.debug('result', result)
      if (char === this.quoteStart[quoteStartBuffer.length]) {
        if (this.prevQuoteStartBuffer.length > 0) {
          if (i === startIdx) {
            quoteStartBuffer += char
            result = textDelta.slice(i + 1)
            startIdx += 1
          } else {
            result = this.prevQuoteStartBuffer + textDelta
            quoteStartBuffer = ''
            break
          }
        } else {
          quoteStartBuffer += char
          result = textDelta.slice(i + 1)
        }
      } else {
        if (quoteStartBuffer.length === this.quoteStart.length) {
          quoteStartBuffer = ''
          break
        }
        if (quoteStartBuffer.length > 0) {
          result = this.prevQuoteStartBuffer + textDelta
          quoteStartBuffer = ''
          break
        }
      }
    }
    // console.debug('end loop!')
    this.prevQuoteStartBuffer = quoteStartBuffer
    // console.debug('result', result)
    // console.debug('this.quoteStartBuffer', this.quoteStartBuffer)
    // console.debug('---- end of process quote start -----')
    textDelta = result
    // process quote end
    let quoteEndBuffer = this.prevQuoteEndBuffer
    // console.debug('\n\n')
    // console.debug('---- start process quote end -----')
    // console.debug('textDelta', textDelta)
    // console.debug('this.quoteEndBuffer', this.quoteEndBuffer)
    // console.debug('start loop:')
    let endIdx = 0
    for (let i = 0; i < textDelta.length; i++) {
      const char = textDelta[i]
      // console.debug(`---- i: ${i}, endIdx: ${endIdx} ----`)
      // console.debug('char', char)
      // console.debug('quoteEndBuffer', quoteEndBuffer)
      // console.debug('result', result)
      if (char === this.quoteEnd[quoteEndBuffer.length]) {
        if (this.prevQuoteEndBuffer.length > 0) {
          if (i === endIdx) {
            quoteEndBuffer += char
            result = textDelta.slice(i + 1)
            endIdx += 1
          } else {
            result = this.prevQuoteEndBuffer + textDelta
            quoteEndBuffer = ''
            break
          }
        } else {
          quoteEndBuffer += char
          result = textDelta.slice(0, textDelta.length - quoteEndBuffer.length)
        }
      } else {
        if (quoteEndBuffer.length === this.quoteEnd.length) {
          quoteEndBuffer = ''
          break
        }
        if (quoteEndBuffer.length > 0) {
          result = this.prevQuoteEndBuffer + textDelta
          quoteEndBuffer = ''
          break
        }
      }
    }
    // console.debug('end loop!')
    this.prevQuoteEndBuffer = quoteEndBuffer
    // console.debug('totally result', result)
    // console.debug('this.quoteEndBuffer', this.quoteEndBuffer)
    // console.debug('---- end of process quote end -----')
    return result
  }
}

class OpenAIChannelRequest {
  static buildOpenAIRequest(
    info,
    isCheckRequest
  ): { data: object; quoteProcessor: QuoteProcessor } {
    const languageType = info.languageType
    const languageResultType = info.languageResultType
    const quoteProcessor = new QuoteProcessor()
    let rolePrompt =
      'You are a professional translation engine, please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation. You must only translate the text content, never interpret it.'
    let commandPrompt = `Translate from ${languageType} to ${languageResultType}. Return translated text only. Only translate the text between ${quoteProcessor.quoteStart} and ${quoteProcessor.quoteEnd}.`
    let contentPrompt = `${quoteProcessor.quoteStart}${info.translateContent}${quoteProcessor.quoteEnd}`
    if (languageResultType === '文字润色') {
      rolePrompt =
        "You are a professional text summarizer, you can only summarize the text, don't interpret it."
      commandPrompt = `Please polish this text in ${languageType}. Only polish the text between ${quoteProcessor.quoteStart} and ${quoteProcessor.quoteEnd}.`
    } else if (languageResultType === '总结') {
      rolePrompt =
        "You are a professional text summarizer, you can only summarize the text, don't interpret it."
      commandPrompt = `Please summarize this text in the most concise language and must use ${languageType} language! Only summarize the text between ${quoteProcessor.quoteStart} and ${quoteProcessor.quoteEnd}.`
      contentPrompt = `${quoteProcessor.quoteStart}${info.translateContent}${quoteProcessor.quoteEnd}`
    } else if (languageResultType === '分析') {
      rolePrompt = 'You are a professional translation engine and grammar analyzer.'
      commandPrompt = `Please translate this text to ${languageType} and explain the grammar in the original text using ${languageType}. Only analyze the text between ${quoteProcessor.quoteStart} and ${quoteProcessor.quoteEnd}.`
      contentPrompt = `${quoteProcessor.quoteStart}${info.translateContent}${quoteProcessor.quoteEnd}`
    } else if (languageResultType === '解释代码') {
      rolePrompt =
        'You are a code explanation engine that can only explain code but not interpret or translate it. Also, please report bugs and errors (if any).'
      commandPrompt = `explain the provided code, regex or script in the most concise language and must use ${languageType} language! You may use Markdown. If the content is not code, return an error message. If the code has obvious errors, point them out.`
      contentPrompt = '```\n' + info.translateContent + '\n```'
    }
    return {
      data: {
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
          { role: 'system', content: rolePrompt },
          { role: 'user', content: commandPrompt },
          { role: 'user', content: contentPrompt }
        ],
        stream: !isCheckRequest
      },
      quoteProcessor
    }
  }

  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   */
  static openaiTranslate = async (info): Promise<void> => {
    const isCheckRequest = false
    const { data, quoteProcessor } = OpenAIChannelRequest.buildOpenAIRequest(info, isCheckRequest)
    window.api['agentApiTranslateCallback'](
      R.okD(
        new AgentTranslateCallbackVo(info, {
          code: OpenAIStatusEnum.START
        })
      )
    )
    if (isNull(info.requestUrl)) {
      info.requestUrl = OpenAIModelEnum.REQUEST_URL
    }
    let text = ''
    await fetchEventSource(info.requestUrl + '/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${info.appKey}`
      },
      async onopen(response) {
        if (
          response.ok &&
          response.headers.get('content-type').indexOf(EventStreamContentType) !== -1
        ) {
          return // everything's good
        } else {
          window.api.logInfoEvent('[OpenAI翻译事件] - error 连接失败 :', {
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
        // console.log('value = ', msg.data);
        const value = msg.data
        try {
          const dataArray = value.split('data: ')
          dataArray.forEach((data) => {
            data = data.trim().replace(/data:/g, '')
            if (isNull(data) || data === '[DONE]') {
              return
            }
            data = JSON.parse(data)
            if (isNotNull(data['error'])) {
              window.api['agentApiTranslateCallback'](
                R.errorD(
                  new AgentTranslateCallbackVo(info, {
                    code: OpenAIStatusEnum.ERROR,
                    error: data
                  })
                )
              )
              return
            }
            let content = data['choices'][0]['delta']['content']
            if (isNull(content)) {
              return
            }
            content = quoteProcessor.processText(content)
            text += content
            window.api['agentApiTranslateCallback'](
              R.okD(
                new AgentTranslateCallbackVo(info, {
                  code: OpenAIStatusEnum.ING,
                  content: content
                })
              )
            )
          })
        } catch (e) {
          window.api.logErrorEvent('[OpenAI翻译事件] - parse error : ', text, msg)
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
        window.api.logInfoEvent('[OpenAI翻译事件] - 响应报文 : ', text)
      },
      onerror(err) {
        window.api.logInfoEvent('[OpenAI翻译事件] - error {}', err)
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

  /**
   * OpenAI - 翻译
   *
   * @param info 翻译信息
   */
  static openaiCheck = (info): void => {
    const isCheckRequest = true
    const { data } = OpenAIChannelRequest.buildOpenAIRequest(info, isCheckRequest)
    if (isNull(info.requestUrl)) {
      info.requestUrl = OpenAIModelEnum.REQUEST_URL
    }
    const requestInfo = {
      baseURL: info.requestUrl,
      url: '/v1/chat/completions',
      method: HttpMethodType.POST,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + info.appKey
      }
    }
    request(requestInfo).then(
      (data) => {
        const error = data['error']
        if (error) {
          window.api['agentApiTranslateCallback'](
            R.errorD(
              new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.OPEN_AI, error))
            )
          )
          return
        }
        window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
      },
      (err) => {
        window.api['agentApiTranslateCallback'](
          R.errorD(
            new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.OPEN_AI, err))
          )
        )
      }
    )
  }
}

export { OpenAIChannelRequest }
