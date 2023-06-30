/**
 * OcrSpace模型枚举
 */
class OcrSpaceModelEnum {
  /**
   * Engine1
   */
  static ONE = '1'

  /**
   * Engine2
   */
  static TWO = '2'

  /**
   * Engine3
   */
  static THREE = '3'

  /**
   * 模型列表
   */
  static MODEL_LIST = [
    {
      value: OcrSpaceModelEnum.ONE,
      label: 'Engine1',
      languageList: [
        { languageName: '中文（简体）', languageType: 'chs' },
        { languageName: '中文（繁体）', languageType: 'cht' },
        { languageName: '英语', languageType: 'eng' },
        { languageName: '日语', languageType: 'jpn' },
        { languageName: '韩语', languageType: 'kor' },
        { languageName: '德语', languageType: 'ger' },
        { languageName: '法语', languageType: 'fre' },
        { languageName: '俄语', languageType: 'rus' },
        { languageName: '阿拉伯语', languageType: 'ara' },
        { languageName: '保加利亚语', languageType: 'bul' },
        { languageName: '克罗地亚语', languageType: 'hrv' },
        { languageName: '捷克语', languageType: 'cze' },
        { languageName: '丹麦语', languageType: 'dan' },
        { languageName: '荷兰语', languageType: 'dut' },
        { languageName: '芬兰语', languageType: 'fin' },
        { languageName: '希腊语', languageType: 'gre' },
        { languageName: '匈牙利语', languageType: 'hun' },
        { languageName: '意大利语', languageType: 'ita' },
        { languageName: '波兰语', languageType: 'pol' },
        { languageName: '葡萄牙语', languageType: 'por' },
        { languageName: '斯洛文尼亚语', languageType: 'slv' },
        { languageName: '西班牙语', languageType: 'spa' },
        { languageName: '瑞典语', languageType: 'swe' },
        { languageName: '土耳其语', languageType: 'tur' }
      ]
    },
    {
      value: OcrSpaceModelEnum.TWO,
      label: 'Engine2',
      languageList: [
        { languageName: '中文（简体）', languageType: 'chs' },
        { languageName: '中文（繁体）', languageType: 'cht' },
        { languageName: '英语', languageType: 'eng' },
        { languageName: '法语', languageType: 'fre' },
        { languageName: '德语', languageType: 'ger' },
        { languageName: '捷克语', languageType: 'cze' },
        { languageName: '丹麦语', languageType: 'dan' },
        { languageName: '荷兰语', languageType: 'dut' },
        { languageName: '芬兰语', languageType: 'fin' },
        { languageName: '意大利语', languageType: 'ita' },
        { languageName: '葡萄牙语', languageType: 'por' },
        { languageName: '斯洛文尼亚语', languageType: 'slv' },
        { languageName: '西班牙语', languageType: 'spa' },
        { languageName: '瑞典语', languageType: 'swe' }
      ]
    },
    {
      value: OcrSpaceModelEnum.THREE,
      label: 'Engine3',
      languageList: [
        { languageName: '中文（简体）', languageType: 'chs' },
        { languageName: '中文（繁体）', languageType: 'cht' },
        { languageName: '英语', languageType: 'eng' },
        { languageName: '日语', languageType: 'jpn' },
        { languageName: '韩语', languageType: 'kor' },
        { languageName: '法语', languageType: 'fre' },
        { languageName: '德语', languageType: 'ger' },
        { languageName: '俄语', languageType: 'rus' },
        { languageName: '泰语', languageType: 'tai' },
        { languageName: '越南语', languageType: 'vie' },
        { languageName: '阿拉伯语', languageType: 'ara' },
        { languageName: '捷克语', languageType: 'cze' },
        { languageName: '丹麦语', languageType: 'dan' },
        { languageName: '荷兰语', languageType: 'dut' },
        { languageName: '芬兰语', languageType: 'fin' },
        { languageName: '意大利语', languageType: 'ita' },
        { languageName: '葡萄牙语', languageType: 'por' },
        { languageName: '西班牙语', languageType: 'spa' },
        { languageName: '土耳其语', languageType: 'tur' },
        { languageName: '印地语', languageType: 'hin' },
        { languageName: '卡纳达语', languageType: 'kan' },
        { languageName: '波斯语', languageType: 'per' },
        { languageName: '泰卢固语', languageType: 'tel' },
        { languageName: '泰米尔语', languageType: 'tam' }
      ]
    }
  ]
}

export { OcrSpaceModelEnum }
