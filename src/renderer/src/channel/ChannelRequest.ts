import { OpenAIChannelRequest } from './OpenAIChannelRequest'
import { BingChannelRequest } from './BingChannelRequest'
import { GoogleChannelRequest } from './GoogleChannelRequest'
import { DeepLChannelRequest } from './DeepLChannelRequest'
import { AzureOpenAIChannelRequest } from './AzureOpenAIChannelRequest'
import { BaiduChannelRequest } from './BaiduChannelRequest'
import { TTimeAIChannelRequest } from './TTimeAIChannelRequest'

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
   * OpenAI - 翻译
   *
   * @param info            翻译信息
   */
  static azureopenaiTranslate = (info): void => {
    if (info.isTranslateCheckType) {
      AzureOpenAIChannelRequest.openaiCheck(info)
    } else {
      AzureOpenAIChannelRequest.openaiTranslate(info)
    }
  }

  /**
   * TTimeAI - 翻译
   *
   * @param info            翻译信息
   */
  static ttimeaiTranslate = (info): void => {
      TTimeAIChannelRequest.openaiTranslate(info)
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

  /**
   * 百度图片翻译
   *
   * @param info 信息
   */
  static baiduimageOcr = (info): void => {
    BaiduChannelRequest.apiOcrImg(info)
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

/**
 * 代理模式 - api翻译
 *
 * @param type 翻译源类型
 * @param info 翻译源类型
 */
window.api['agentApiOcr']((info) => {
  ChannelRequest[info.type.toLowerCase() + 'Ocr'](info)
})
