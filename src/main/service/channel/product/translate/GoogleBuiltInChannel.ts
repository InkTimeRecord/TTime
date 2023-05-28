import ITranslateInterface from './ITranslateInterface'

class GoogleBuiltInChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(_info): void {


  }

  apiTranslateCheck(_info): void {
  }

}

export default GoogleBuiltInChannel
