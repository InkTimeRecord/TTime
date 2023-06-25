/**
 * 火山OCR类型枚举
 */
class VolcanoOcrModelEnum {
  /**
   * 多语种OCR
   */
  static MULTI_LANGUAGE_OCR = 'MultiLanguageOCR'

  /**
   * 通用文字识别
   */
  static OCR_NORMAL = 'OCRNormal'

  /**
   * 模型列表
   */
  static MODEL_LIST = [
    {
      value: VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR,
      label: '多语种OCR'
    },
    {
      value: VolcanoOcrModelEnum.OCR_NORMAL,
      label: '通用文字识别'
    }
  ]
}

export { VolcanoOcrModelEnum }
