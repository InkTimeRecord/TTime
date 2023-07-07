import { OpenAIChannelRequest } from './OpenAIChannelRequest'
import { BingChannelRequest } from './BingChannelRequest'
import { GoogleChannelRequest } from './GoogleChannelRequest'
import { DeepLChannelRequest } from './DeepLChannelRequest'

class ChannelRequest {
  /**
   * DeepL - 翻译
   *
   * @param info 翻译信息
   */
  static deeplTranslate = (info): void => {
    DeepLChannelRequest.apiTranslateByDeepL(info)
  }

  /**
   * DeepL - 翻译
   *
   * @param info 翻译信息
   */
  static deeplbuiltinTranslate = (info): void => {
    DeepLChannelRequest.apiTranslateByDeepLBuiltIn(info)
  }

  /**
   * Google - 翻译
   *
   * @param info 翻译信息
   */
  static googleTranslate = (info): void => {
    GoogleChannelRequest.apiTranslateByGoogle(info)
  }

  /**
   * Google - 翻译
   *
   * @param info 翻译信息
   */
  static googlebuiltinTranslate = (info): void => {
    GoogleChannelRequest.apiTranslateByGoogleBuiltIn(info)
  }

  /**
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   */
  static openaiTranslate = (info): void => {
    if (info.isTranslateCheckType) {
      OpenAIChannelRequest.openaiCheck(info)
    } else {
      OpenAIChannelRequest.openaiTranslate(info)
    }
  }

  /**
   * bing - 翻译
   *
   * @param info 翻译信息
   */
  static bingTranslate = (info): void => {
    BingChannelRequest.apiTranslateByBing(info)
  }

  /**
   * bing字典 - 翻译
   *
   * @param info 翻译信息
   */
  static bingdictTranslate = (info): void => {
    BingChannelRequest.apiTranslateByBingDict(info)
  }
}

/**
 * 代理模式 - api翻译
 *
 * @param type 翻译源类型
 * @param info 翻译源类型
 */
window.api['agentApiTranslate']((info) => {
  ChannelRequest[info.type.toLowerCase() + 'Translate'](info)
})
