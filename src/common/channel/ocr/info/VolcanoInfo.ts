import { VolcanoOcrModelEnum } from '../../../enums/VolcanoOcrModelEnum'

export default {
  name: '火山OCR',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: false,
  // 构建时默认信息
  defaultInfo: {
    model: VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR
  }
}
