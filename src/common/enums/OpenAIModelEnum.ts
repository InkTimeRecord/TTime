/**
 * OpenAI模型枚举
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
   * gpt-3.5-turbo-0613
   */
  static GPT_TURBO_35_0613 = 'gpt-3.5-turbo-0613'

  /**
   * gpt-3.5-turbo-16K
   */
  static GPT_TURBO_35_16K = 'gpt-3.5-turbo-16k'

  /**
   * gpt-3.5-turbo-0301
   */
  static GPT_TURBO_35_16K_0613 = 'gpt-3.5-turbo-16k-0613'

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
    },
    {
      value: OpenAIModelEnum.GPT_TURBO_35_0613,
      label: OpenAIModelEnum.GPT_TURBO_35_0613
    },
    {
      value: OpenAIModelEnum.GPT_TURBO_35_16K,
      label: OpenAIModelEnum.GPT_TURBO_35_16K
    },
    {
      value: OpenAIModelEnum.GPT_TURBO_35_16K_0613,
      label: OpenAIModelEnum.GPT_TURBO_35_16K_0613
    }
  ]
}

export { OpenAIModelEnum }
