import { OcrSpaceModelEnum } from '../../../enums/OcrSpaceModelEnum'

export default {
  name: 'Ocr Space',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: true,
  // 构建时默认信息
  defaultInfo: {
    model: OcrSpaceModelEnum.ONE,
    languageType: 'eng'
  }
}
