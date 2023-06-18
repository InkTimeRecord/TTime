/**
 * 翻译服务枚举
 */
class OpenAIModelEnum {
  /**
   * gpt-3.5-turbo
   */
  static GPT_TURBO_35 = 'gpt-3.5-turbo'

  /**
   * gpt-3.5-turbo-0301
   */
  static GPT_TURBO_35_0301 = 'gpt-3.5-turbo-0301'

  /**
   * 默认请求URL
   */
  static REQUEST_URL = 'https://api.openai.com'

  /**
   * 模型列表
   */
  static MODEL_LIST = [
    {
      value: OpenAIModelEnum.GPT_TURBO_35,
      label: OpenAIModelEnum.GPT_TURBO_35
    },
    {
      value: OpenAIModelEnum.GPT_TURBO_35_0301,
      label: OpenAIModelEnum.GPT_TURBO_35_0301
    }
  ]
}

export { OpenAIModelEnum }
