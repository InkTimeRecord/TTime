import NiuTransChannel from './NiuTransChannel'

class NiuTransBuiltInChannel extends NiuTransChannel {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    info.appKey = 'cac7d8ffe82465cb2559f0f3afb07062'
    super.apiTranslate(info)
  }
}

export default NiuTransBuiltInChannel
