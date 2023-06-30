/**
 * 翻译结果
 */
class TranslateVo {
  /**
   * 翻译结果列表
   */
  translateList: string[] | string

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

  dictBuild(usPhonetic, ukPhonetic, usSpeech, ukSpeech, explains, wfs): void {
    this.usPhonetic = usPhonetic
    this.ukPhonetic = ukPhonetic
    this.usSpeech = usSpeech
    this.ukSpeech = ukSpeech
    this.explains = explains
    this.wfs = wfs
  }
}

export default TranslateVo
