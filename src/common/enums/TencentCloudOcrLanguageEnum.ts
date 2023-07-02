/**
 * 腾讯云OCR语言枚举
 */
class TencentCloudOcrLanguageEnum {
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
      label: '自动检测'
    },
    {
      value: 'zh',
      label: '中英混合'
    },
    {
      value: 'zh_rare',
      label: '支持英文、数字、中文生僻字、繁体字，特殊符号等'
    },
    {
      value: 'mix',
      label: '混合语种'
    },
    {
      value: 'jap',
      label: '日语'
    },
    {
      value: 'kor',
      label: '韩语'
    },
    {
      value: 'spa',
      label: '西班牙语'
    },
    {
      value: 'fre',
      label: '法语'
    },
    {
      value: 'ger',
      label: '德语'
    },
    {
      value: 'por',
      label: '葡萄牙语'
    },
    {
      value: 'vie',
      label: '越语'
    },
    {
      value: 'may',
      label: '马来语'
    },
    {
      value: 'rus',
      label: '俄语'
    },
    {
      value: 'ita',
      label: '意大利语'
    },
    {
      value: 'hol',
      label: '荷兰语'
    },
    {
      value: 'swe',
      label: '瑞典语'
    },
    {
      value: 'fin',
      label: '芬兰语'
    },
    {
      value: 'dan',
      label: '丹麦语'
    },
    {
      value: 'nor',
      label: '挪威语'
    },
    {
      value: 'hun',
      label: '匈牙利语'
    },
    {
      value: 'tha',
      label: '泰语'
    },
    {
      value: 'hi',
      label: '印地语'
    },
    {
      value: 'ara',
      label: '阿拉伯语'
    }
  ]
}

export { TencentCloudOcrLanguageEnum }
