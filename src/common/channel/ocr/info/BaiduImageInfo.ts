import { BaiduImageOcrLanguageEnum } from '../../../enums/BaiduImageOcrLanguageEnum'

export default {
  name: '百度图片翻译',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: false,
  // 构建时默认信息
  defaultInfo: {
    languageType: BaiduImageOcrLanguageEnum.AUTO
  }
}
