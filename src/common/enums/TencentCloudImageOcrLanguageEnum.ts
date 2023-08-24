/**
 * 腾讯云图片翻译OCR语言枚举
 */
class TencentCloudImageOcrLanguageEnum {
  /**
   * AUTO
   */
  static AUTO = 'auto'

  /**
   * OCR语言列表
   */
  static OCR_LANGUAGE_LIST = [
    {
      value: 'auto',
      label: '自动识别（识别为一种语言）'
    },
    {
      value: 'zh',
      label: '简体中文'
    },
    {
      value: 'zh-TW',
      label: '繁体中文'
    },
    {
      value: 'en',
      label: '英语'
    },
    {
      value: 'ja',
      label: '日语'
    },
    {
      value: 'ko',
      label: '韩语'
    },
    {
      value: 'ru',
      label: '俄语'
    },
    {
      value: 'fr',
      label: '法语'
    },
    {
      value: 'de',
      label: '德语'
    },
    {
      value: 'it',
      label: '意大利语'
    },
    {
      value: 'es',
      label: '西班牙语'
    },
    {
      value: 'pt',
      label: '葡萄牙语'
    },
    {
      value: 'ms',
      label: '马来西亚语'
    },
    {
      value: 'th',
      label: '泰语'
    },
    {
      value: 'vi',
      label: '越南语'
    }
  ]
}

export { TencentCloudImageOcrLanguageEnum }
