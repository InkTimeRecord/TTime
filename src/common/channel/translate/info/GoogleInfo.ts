export default {
  name: 'Google翻译',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: true,
  // 翻译语言
  languageList: [
    {
      languageName: '南非荷兰语',
      languageType: 'af'
    },
    {
      languageName: '阿尔巴尼亚语',
      languageType: 'sq'
    },
    {
      languageName: '阿姆哈拉语',
      languageType: 'am'
    },
    {
      languageName: '阿拉伯语',
      languageType: 'ar'
    },
    {
      languageName: '亚美尼亚文',
      languageType: 'hy'
    },
    {
      languageName: '阿萨姆语',
      languageType: 'as'
    },
    {
      languageName: '艾马拉语',
      languageType: 'ay'
    },
    {
      languageName: '阿塞拜疆语',
      languageType: 'az'
    },
    {
      languageName: '班巴拉语',
      languageType: 'bm'
    },
    {
      languageName: '巴斯克语',
      languageType: 'eu'
    },
    {
      languageName: '白俄罗斯语',
      languageType: 'be'
    },
    {
      languageName: '孟加拉语',
      languageType: 'bn'
    },
    {
      languageName: '博杰普尔语',
      languageType: 'bho'
    },
    {
      languageName: '波斯尼亚语',
      languageType: 'bs'
    },
    {
      languageName: '保加利亚语',
      languageType: 'bg'
    },
    {
      languageName: '加泰罗尼亚语',
      languageType: 'ca'
    },
    {
      languageName: '宿务语',
      languageType: 'ceb'
    },
    {
      languageName: '中文(简体)',
      languageType: 'zh'
    },
    {
      languageName: '中文(繁体)',
      languageType: 'zh-TW'
    },
    {
      languageName: '科西嘉语',
      languageType: 'co'
    },
    {
      languageName: '克罗地亚语',
      languageType: 'hr'
    },
    {
      languageName: '捷克语',
      languageType: 'cs'
    },
    {
      languageName: '丹麦语',
      languageType: 'da'
    },
    {
      languageName: '迪维希语',
      languageType: 'dv'
    },
    {
      languageName: '多格来语',
      languageType: 'doi'
    },
    {
      languageName: '荷兰语',
      languageType: 'nl'
    },
    {
      languageName: '英语',
      languageType: 'en'
    },
    {
      languageName: '世界语',
      languageType: 'eo'
    },
    {
      languageName: '爱沙尼亚语',
      languageType: 'et'
    },
    {
      languageName: '埃维语',
      languageType: 'ee'
    },
    {
      languageName: '菲律宾语（塔加拉语）',
      languageType: 'fil'
    },
    {
      languageName: '芬兰语',
      languageType: 'fi'
    },
    {
      languageName: '法语',
      languageType: 'fr'
    },
    {
      languageName: '弗里斯兰语',
      languageType: 'fy'
    },
    {
      languageName: '加利西亚语',
      languageType: 'gl'
    },
    {
      languageName: '格鲁吉亚语',
      languageType: 'ka'
    },
    {
      languageName: '德语',
      languageType: 'de'
    },
    {
      languageName: '希腊文',
      languageType: 'el'
    },
    {
      languageName: '瓜拉尼人',
      languageType: 'gn'
    },
    {
      languageName: '古吉拉特文',
      languageType: 'gu'
    },
    {
      languageName: '海地克里奥尔语',
      languageType: 'ht'
    },
    {
      languageName: '豪萨语',
      languageType: 'ha'
    },
    {
      languageName: '夏威夷语',
      languageType: 'haw'
    },
    {
      languageName: '希伯来语',
      languageType: 'he'
    },
    {
      languageName: '印地语',
      languageType: 'hi'
    },
    {
      languageName: '苗语',
      languageType: 'hmn'
    },
    {
      languageName: '匈牙利语',
      languageType: 'hu'
    },
    {
      languageName: '冰岛语',
      languageType: 'is'
    },
    {
      languageName: '伊博语',
      languageType: 'ig'
    },
    {
      languageName: '伊洛卡诺语',
      languageType: 'ilo'
    },
    {
      languageName: '印度尼西亚语',
      languageType: 'id'
    },
    {
      languageName: '爱尔兰语',
      languageType: 'ga'
    },
    {
      languageName: '意大利语',
      languageType: 'it'
    },
    {
      languageName: '日语',
      languageType: 'ja'
    },
    {
      languageName: '爪哇语',
      languageType: 'jv'
    },
    {
      languageName: '卡纳达文',
      languageType: 'kn'
    },
    {
      languageName: '哈萨克语',
      languageType: 'kk'
    },
    {
      languageName: '高棉语',
      languageType: 'km'
    },
    {
      languageName: '卢旺达语',
      languageType: 'rw'
    },
    {
      languageName: '贡根语',
      languageType: 'gom'
    },
    {
      languageName: '韩语',
      languageType: 'ko'
    },
    {
      languageName: '克里奥尔语',
      languageType: 'kri'
    },
    {
      languageName: '库尔德语',
      languageType: 'ku'
    },
    {
      languageName: '库尔德语（索拉尼）',
      languageType: 'ckb'
    },
    {
      languageName: '吉尔吉斯语',
      languageType: 'ky'
    },
    {
      languageName: '老挝语',
      languageType: 'lo'
    },
    {
      languageName: '拉丁文',
      languageType: 'la'
    },
    {
      languageName: '拉脱维亚语',
      languageType: 'lv'
    },
    {
      languageName: '林格拉语',
      languageType: 'ln'
    },
    {
      languageName: '立陶宛语',
      languageType: 'lt'
    },
    {
      languageName: '卢干达语',
      languageType: 'lg'
    },
    {
      languageName: '卢森堡语',
      languageType: 'lb'
    },
    {
      languageName: '马其顿语',
      languageType: 'mk'
    },
    {
      languageName: '迈蒂利语',
      languageType: 'mai'
    },
    {
      languageName: '马尔加什语',
      languageType: 'mg'
    },
    {
      languageName: '马来语',
      languageType: 'ms'
    },
    {
      languageName: '马拉雅拉姆文',
      languageType: 'ml'
    },
    {
      languageName: '马耳他语',
      languageType: 'mt'
    },
    {
      languageName: '毛利语',
      languageType: 'mi'
    },
    {
      languageName: '马拉地语',
      languageType: 'mr'
    },
    {
      languageName: '梅泰语（曼尼普尔语）',
      languageType: 'mni-Mtei'
    },
    {
      languageName: '米佐语',
      languageType: 'lus'
    },
    {
      languageName: '蒙古文',
      languageType: 'mn'
    },
    {
      languageName: '缅甸语',
      languageType: 'my'
    },
    {
      languageName: '尼泊尔语',
      languageType: 'ne'
    },
    {
      languageName: '挪威语',
      languageType: 'no'
    },
    {
      languageName: '尼杨扎语（齐切瓦语）',
      languageType: 'ny'
    },
    {
      languageName: '奥里亚语（奥里亚）',
      languageType: 'or'
    },
    {
      languageName: '奥罗莫语',
      languageType: 'om'
    },
    {
      languageName: '普什图语',
      languageType: 'ps'
    },
    {
      languageName: '波斯语',
      languageType: 'fa'
    },
    {
      languageName: '波兰语',
      languageType: 'pl'
    },
    {
      languageName: '葡萄牙语',
      languageType: 'pt'
    },
    {
      languageName: '旁遮普语',
      languageType: 'pa'
    },
    {
      languageName: '克丘亚语',
      languageType: 'qu'
    },
    {
      languageName: '罗马尼亚语',
      languageType: 'ro'
    },
    {
      languageName: '俄语',
      languageType: 'ru'
    },
    {
      languageName: '萨摩亚语',
      languageType: 'sm'
    },
    {
      languageName: '梵语',
      languageType: 'sa'
    },
    {
      languageName: '苏格兰盖尔语',
      languageType: 'gd'
    },
    {
      languageName: '塞佩蒂语',
      languageType: 'nso'
    },
    {
      languageName: '塞尔维亚语',
      languageType: 'sr'
    },
    {
      languageName: '塞索托语',
      languageType: 'st'
    },
    {
      languageName: '修纳语',
      languageType: 'sn'
    },
    {
      languageName: '信德语',
      languageType: 'sd'
    },
    {
      languageName: '僧伽罗语',
      languageType: 'si'
    },
    {
      languageName: '斯洛伐克语',
      languageType: 'sk'
    },
    {
      languageName: '斯洛文尼亚语',
      languageType: 'sl'
    },
    {
      languageName: '索马里语',
      languageType: 'so'
    },
    {
      languageName: '西班牙语',
      languageType: 'es'
    },
    {
      languageName: '巽他语',
      languageType: 'su'
    },
    {
      languageName: '斯瓦希里语',
      languageType: 'sw'
    },
    {
      languageName: '瑞典语',
      languageType: 'sv'
    },
    {
      languageName: '塔加路语（菲律宾语）',
      languageType: 'tl'
    },
    {
      languageName: '塔吉克语',
      languageType: 'tg'
    },
    {
      languageName: '泰米尔语',
      languageType: 'ta'
    },
    {
      languageName: '鞑靼语',
      languageType: 'tt'
    },
    {
      languageName: '泰卢固语',
      languageType: 'te'
    },
    {
      languageName: '泰语',
      languageType: 'th'
    },
    {
      languageName: '蒂格尼亚语',
      languageType: 'ti'
    },
    {
      languageName: '宗加语',
      languageType: 'ts'
    },
    {
      languageName: '土耳其语',
      languageType: 'tr'
    },
    {
      languageName: '土库曼语',
      languageType: 'tk'
    },
    {
      languageName: '契维语（阿坎语）',
      languageType: 'ak'
    },
    {
      languageName: '乌克兰语',
      languageType: 'uk'
    },
    {
      languageName: '乌尔都语',
      languageType: 'ur'
    },
    {
      languageName: '维吾尔语',
      languageType: 'ug'
    },
    {
      languageName: '乌兹别克语',
      languageType: 'uz'
    },
    {
      languageName: '越南语',
      languageType: 'vi'
    },
    {
      languageName: '威尔士语',
      languageType: 'cy'
    },
    {
      languageName: '班图语',
      languageType: 'xh'
    },
    {
      languageName: '意第绪语',
      languageType: 'yi'
    },
    {
      languageName: '约鲁巴语',
      languageType: 'yo'
    },
    {
      languageName: '祖鲁语',
      languageType: 'zu'
    }
  ]
}
