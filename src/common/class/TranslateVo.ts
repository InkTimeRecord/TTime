/**
 * 翻译结果
 */
class TranslateVo {
  /**
   * 请求ID
   */
  requestId: string

  /**
   * 翻译服务ID
   */
  translateServiceId: string

  /**
   * 翻译结果列表
   */
  translateList: string[] | string

  /**
   * 音标
   */
  phonetic!: string

  /**
   * 美式音标
   */
  usPhonetic!: string

  /**
   * 英式音标
   */
  ukPhonetic!: string

  /**
   * 美式发音
   */
  usSpeech!: string

  /**
   * 英式发音
   */
  ukSpeech!: string

  /**
   * 解释
   */
  explains!: Array<string>

  /**
   * 其他形式
   */
  wfs!: Array<object>

  constructor(translateList: string[] | string) {
    this.translateList = translateList
  }

  dictBuild(info, usPhonetic, ukPhonetic, usSpeech, ukSpeech, explains, wfs): void {
    this.requestId = info.requestId
    this.translateServiceId = info.id
    this.usPhonetic = usPhonetic
    this.ukPhonetic = ukPhonetic
    this.usSpeech = usSpeech
    this.ukSpeech = ukSpeech
    this.explains = explains
    this.wfs = wfs
  }

  dictLessBuild(info, phonetic, explains, wfs): void {
    this.requestId = info.requestId
    this.translateServiceId = info.id
    this.phonetic = phonetic
    this.explains = explains
    this.wfs = wfs
  }
}

export default TranslateVo
