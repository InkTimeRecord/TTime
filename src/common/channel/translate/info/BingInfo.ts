export default {
  name: 'Bing翻译(内置)',
  // 是否需要秘钥
  isKey: false,
  // 是否单秘钥
  isOneAppKey: false,
  // 翻译语言
  languageList: [
    {
      languageName: '中文(简体)',
      languageType: 'zh-Hans'
    },
    {
      languageName: '中文(繁体)',
      languageType: 'zh-Hant'
    },
    {
      languageName: '粤语(繁体)',
      languageType: 'yue'
    },
    {
      languageName: '英语',
      languageType: 'en'
    },
    {
      languageName: '俄语',
      languageType: 'ru'
    },
    {
      languageName: '德语',
      languageType: 'de'
    },
    {
      languageName: '南非荷兰语',
      languageType: 'af'
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
      languageName: '阿萨姆语',
      languageType: 'as'
    },
    {
      languageName: '阿塞拜疆语',
      languageType: 'az'
    },
    {
      languageName: '巴什基尔语',
      languageType: 'ba'
    },
    {
      languageName: '保加利亚语',
      languageType: 'bg'
    },
    {
      languageName: '孟加拉语',
      languageType: 'bn'
    },
    {
      languageName: '藏语',
      languageType: 'bo'
    },
    {
      languageName: '波斯尼亚语',
      languageType: 'bs'
    },
    {
      languageName: '加泰罗尼亚语',
      languageType: 'ca'
    },
    {
      languageName: '捷克语',
      languageType: 'cs'
    },
    {
      languageName: '威尔士语',
      languageType: 'cy'
    },
    {
      languageName: '丹麦语',
      languageType: 'da'
    },
    {
      languageName: 'Lower Sorbian',
      languageType: 'dsb'
    },
    {
      languageName: '迪维希语',
      languageType: 'dv'
    },
    {
      languageName: '希腊语',
      languageType: 'el'
    },
    {
      languageName: '西班牙语',
      languageType: 'es'
    },
    {
      languageName: '爱沙尼亚语',
      languageType: 'et'
    },
    {
      languageName: '巴斯克语',
      languageType: 'eu'
    },
    {
      languageName: '波斯语',
      languageType: 'fa'
    },
    {
      languageName: '芬兰语',
      languageType: 'fi'
    },
    {
      languageName: '菲律宾语',
      languageType: 'fil'
    },
    {
      languageName: '斐济语',
      languageType: 'fj'
    },
    {
      languageName: '法罗语',
      languageType: 'fo'
    },
    {
      languageName: '法语',
      languageType: 'fr'
    },
    {
      languageName: '法语(加拿大)',
      languageType: 'fr-CA'
    },
    {
      languageName: '爱尔兰语',
      languageType: 'ga'
    },
    {
      languageName: '加利西亚语',
      languageType: 'gl'
    },
    {
      languageName: 'Konkani',
      languageType: 'gom'
    },
    {
      languageName: '古吉拉特语',
      languageType: 'gu'
    },
    {
      languageName: 'Hausa',
      languageType: 'ha'
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
      languageName: '克罗地亚语',
      languageType: 'hr'
    },
    {
      languageName: '上索布语',
      languageType: 'hsb'
    },
    {
      languageName: '海地克里奥尔语',
      languageType: 'ht'
    },
    {
      languageName: '匈牙利语',
      languageType: 'hu'
    },
    {
      languageName: '亚美尼亚语',
      languageType: 'hy'
    },
    {
      languageName: '印度尼西亚语',
      languageType: 'id'
    },
    {
      languageName: '伊博语',
      languageType: 'ig'
    },
    {
      languageName: 'Inuinnaqtun',
      languageType: 'ikt'
    },
    {
      languageName: '冰岛语',
      languageType: 'is'
    },
    {
      languageName: '意大利语',
      languageType: 'it'
    },
    {
      languageName: '因纽特语',
      languageType: 'iu'
    },
    {
      languageName: 'Inuktitut(Latin)',
      languageType: 'iu-Latn'
    },
    {
      languageName: '日语',
      languageType: 'ja'
    },
    {
      languageName: '格鲁吉亚语',
      languageType: 'ka'
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
      languageName: '库尔德语(北)',
      languageType: 'kmr'
    },
    {
      languageName: '卡纳达语',
      languageType: 'kn'
    },
    {
      languageName: '韩语',
      languageType: 'ko'
    },
    {
      languageName: '库尔德语(中)',
      languageType: 'ku'
    },
    {
      languageName: '柯尔克孜语',
      languageType: 'ky'
    },
    {
      languageName: '林加拉语',
      languageType: 'ln'
    },
    {
      languageName: '老挝语',
      languageType: 'lo'
    },
    {
      languageName: '立陶宛语',
      languageType: 'lt'
    },
    {
      languageName: 'Ganda',
      languageType: 'lug'
    },
    {
      languageName: '拉脱维亚语',
      languageType: 'lv'
    },
    {
      languageName: 'Chinese(Literary)',
      languageType: 'lzh'
    },
    {
      languageName: 'Maithili',
      languageType: 'mai'
    },
    {
      languageName: '马拉加斯语',
      languageType: 'mg'
    },
    {
      languageName: '毛利语',
      languageType: 'mi'
    },
    {
      languageName: '马其顿语',
      languageType: 'mk'
    },
    {
      languageName: '马拉雅拉姆语',
      languageType: 'ml'
    },
    {
      languageName: 'Mongolian(Cyrillic)',
      languageType: 'mn-Cyrl'
    },
    {
      languageName: 'Mongolian(Traditional)',
      languageType: 'mn-Mong'
    },
    {
      languageName: '马拉地语',
      languageType: 'mr'
    },
    {
      languageName: '马来语',
      languageType: 'ms'
    },
    {
      languageName: '马耳他语',
      languageType: 'mt'
    },
    {
      languageName: '苗语',
      languageType: 'mww'
    },
    {
      languageName: '缅甸语',
      languageType: 'my'
    },
    {
      languageName: '书面挪威语',
      languageType: 'nb'
    },
    {
      languageName: '尼泊尔语',
      languageType: 'ne'
    },
    {
      languageName: '荷兰语',
      languageType: 'nl'
    },
    {
      languageName: 'Sesotho sa Leboa',
      languageType: 'nso'
    },
    {
      languageName: 'Nyanja',
      languageType: 'nya'
    },
    {
      languageName: '奥里亚语',
      languageType: 'or'
    },
    {
      languageName: '克雷塔罗奥托米语',
      languageType: 'otq'
    },
    {
      languageName: '旁遮普语',
      languageType: 'pa'
    },
    {
      languageName: '波兰语',
      languageType: 'pl'
    },
    {
      languageName: '达里语',
      languageType: 'prs'
    },
    {
      languageName: '普什图语',
      languageType: 'ps'
    },
    {
      languageName: '葡萄牙语(巴西)',
      languageType: 'pt'
    },
    {
      languageName: '葡萄牙语(葡萄牙)',
      languageType: 'pt-PT'
    },
    {
      languageName: '罗马尼亚语',
      languageType: 'ro'
    },
    {
      languageName: 'Rundi',
      languageType: 'run'
    },
    {
      languageName: 'Kinyarwanda',
      languageType: 'rw'
    },
    {
      languageName: 'Sindhi',
      languageType: 'sd'
    },
    {
      languageName: 'Sinhala',
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
      languageName: '萨摩亚语',
      languageType: 'sm'
    },
    {
      languageName: '绍纳语',
      languageType: 'sn'
    },
    {
      languageName: '索马里语',
      languageType: 'so'
    },
    {
      languageName: '阿尔巴尼亚语',
      languageType: 'sq'
    },
    {
      languageName: '塞尔维亚语(西里尔文)',
      languageType: 'sr-Cyrl'
    },
    {
      languageName: '塞尔维亚语(拉丁文)',
      languageType: 'sr-Latn'
    },
    {
      languageName: 'Sesotho',
      languageType: 'st'
    },
    {
      languageName: '瑞典语',
      languageType: 'sv'
    },
    {
      languageName: '斯瓦希里语',
      languageType: 'sw'
    },
    {
      languageName: '泰米尔语',
      languageType: 'ta'
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
      languageName: '提格利尼亚语',
      languageType: 'ti'
    },
    {
      languageName: '土库曼语',
      languageType: 'tk'
    },
    {
      languageName: '克林贡语(拉丁文)',
      languageType: 'tlh-Latn'
    },
    {
      languageName: '克林贡语(pIqaD)',
      languageType: 'tlh-Piqd'
    },
    {
      languageName: 'Setswana',
      languageType: 'tn'
    },
    {
      languageName: '汤加语',
      languageType: 'to'
    },
    {
      languageName: '土耳其语',
      languageType: 'tr'
    },
    {
      languageName: '鞑靼语',
      languageType: 'tt'
    },
    {
      languageName: '塔希提语',
      languageType: 'ty'
    },
    {
      languageName: '维吾尔语',
      languageType: 'ug'
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
      languageName: '乌兹别克语',
      languageType: 'uz'
    },
    {
      languageName: '越南语',
      languageType: 'vi'
    },
    {
      languageName: '科萨语',
      languageType: 'xh'
    },
    {
      languageName: 'Yoruba',
      languageType: 'yo'
    },
    {
      languageName: '尤卡特克玛雅语',
      languageType: 'yua'
    },
    {
      languageName: '祖鲁语',
      languageType: 'zu'
    }
  ]
}
