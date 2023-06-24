import { OpenAIModelEnum } from '../../../enums/OpenAIModelEnum'

export default {
  name: 'OpenAI翻译',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: true,
  // 构建时默认信息
  defaultInfo: {
    model: OpenAIModelEnum.GPT_TURBO_35,
    requestUrl: OpenAIModelEnum.REQUEST_URL
  },
  // 翻译语言
  languageList: [
    {
      languageName: '文字润色',
      languageType: '文字润色'
    },
    {
      languageName: '总结',
      languageType: '总结'
    },
    {
      languageName: '分析',
      languageType: '分析'
    },
    {
      languageName: '解释代码',
      languageType: '解释代码'
    },
    {
      languageName: '中文(简体)',
      languageType: '中文(简体)'
    },
    {
      languageName: '中文(繁体)',
      languageType: '繁體中文(繁體)'
    },
    {
      languageName: '中文(文言文)',
      languageType: '中文(文言文)'
    },
    {
      languageName: '中文(粤语)',
      languageType: '粵語(繁體)'
    },
    {
      languageName: '英语',
      languageType: 'English'
    },
    {
      languageName: '日语',
      languageType: '日本語'
    },
    {
      languageName: '俄语',
      languageType: 'Русский'
    },
    {
      languageName: '法语',
      languageType: 'Français'
    },
    {
      languageName: '韩语',
      languageType: '한국어'
    },
    {
      languageName: '南非荷兰语',
      languageType: 'Afrikaans'
    },
    {
      languageName: '阿姆哈拉语',
      languageType: 'አማርኛ'
    },
    {
      languageName: '阿拉伯语',
      languageType: 'العربية'
    },
    {
      languageName: '阿萨姆语',
      languageType: 'অসমীয়া'
    },
    {
      languageName: '阿塞拜疆语',
      languageType: 'Azərbaycan'
    },
    {
      languageName: '巴什基尔语',
      languageType: 'Bashkir'
    },
    {
      languageName: '保加利亚语',
      languageType: 'Български'
    },
    {
      languageName: '孟加拉语',
      languageType: 'বাংলা'
    },
    {
      languageName: '藏语',
      languageType: 'བོད་སྐད་'
    },
    {
      languageName: '波斯尼亚语',
      languageType: 'Bosnian'
    },
    {
      languageName: '加泰罗尼亚语',
      languageType: 'Català'
    },
    {
      languageName: '捷克语',
      languageType: 'Čeština'
    },
    {
      languageName: '威尔士语',
      languageType: 'Cymraeg'
    },
    {
      languageName: '丹麦语',
      languageType: 'Dansk'
    },
    {
      languageName: '德语',
      languageType: 'Deutsch'
    },
    {
      languageName: 'Lower Sorbian',
      languageType: 'Dolnoserbšćina'
    },
    {
      languageName: '迪维希语',
      languageType: 'ދިވެހިބަސް'
    },
    {
      languageName: '希腊语',
      languageType: 'Ελληνικά'
    },
    {
      languageName: '西班牙语',
      languageType: 'Español'
    },
    {
      languageName: '爱沙尼亚语',
      languageType: 'Eesti'
    },
    {
      languageName: '巴斯克语',
      languageType: 'Euskara'
    },
    {
      languageName: '波斯语',
      languageType: 'فارسی'
    },
    {
      languageName: '芬兰语',
      languageType: 'Suomi'
    },
    {
      languageName: '菲律宾语',
      languageType: 'Filipino'
    },
    {
      languageName: '斐济语',
      languageType: 'Na Vosa Vakaviti'
    },
    {
      languageName: '法罗语',
      languageType: 'Føroyskt'
    },
    {
      languageName: '法语(加拿大)',
      languageType: 'Français (Canada)'
    },
    {
      languageName: '爱尔兰语',
      languageType: 'Gaeilge'
    },
    {
      languageName: '加利西亚语',
      languageType: 'Galego'
    },
    {
      languageName: 'Konkani',
      languageType: 'Konkani'
    },
    {
      languageName: '古吉拉特语',
      languageType: 'ગુજરાતી'
    },
    {
      languageName: 'Hausa',
      languageType: 'Hausa'
    },
    {
      languageName: '希伯来语',
      languageType: 'עברית'
    },
    {
      languageName: '印地语',
      languageType: 'हिन्दी'
    },
    {
      languageName: '克罗地亚语',
      languageType: 'Hrvatski'
    },
    {
      languageName: '上索布语',
      languageType: 'Hornjoserbšćina'
    },
    {
      languageName: '海地克里奥尔语',
      languageType: 'Haitian Creole'
    },
    {
      languageName: '匈牙利语',
      languageType: 'Magyar'
    },
    {
      languageName: '亚美尼亚语',
      languageType: 'Հայերեն'
    },
    {
      languageName: '印度尼西亚语',
      languageType: 'Indonesia'
    },
    {
      languageName: '伊博语',
      languageType: 'Ásụ̀sụ́ Ìgbò'
    },
    {
      languageName: 'Inuinnaqtun',
      languageType: 'Inuinnaqtun'
    },
    {
      languageName: '冰岛语',
      languageType: 'Íslenska'
    },
    {
      languageName: '意大利语',
      languageType: 'Italiano'
    },
    {
      languageName: '因纽特语',
      languageType: 'ᐃᓄᒃᑎᑐᑦ'
    },
    {
      languageName: 'Inuktitut(Latin)',
      languageType: 'Inuktitut (Latin)'
    },
    {
      languageName: '格鲁吉亚语',
      languageType: 'ქართული'
    },
    {
      languageName: '哈萨克语',
      languageType: 'Қазақ Тілі'
    },
    {
      languageName: '高棉语',
      languageType: 'ខ្មែរ'
    },
    {
      languageName: '库尔德语(北)',
      languageType: 'Kurdî (Bakur)'
    },
    {
      languageName: '卡纳达语',
      languageType: 'ಕನ್ನಡ'
    },
    {
      languageName: '库尔德语(中)',
      languageType: 'Kurdî (Navîn)'
    },
    {
      languageName: '柯尔克孜语',
      languageType: 'Кыргызча'
    },
    {
      languageName: '林加拉语',
      languageType: 'Lingála'
    },
    {
      languageName: '老挝语',
      languageType: 'ລາວ'
    },
    {
      languageName: '立陶宛语',
      languageType: 'Lietuvių'
    },
    {
      languageName: 'Ganda',
      languageType: 'Ganda'
    },
    {
      languageName: '拉脱维亚语',
      languageType: 'Latviešu'
    },
    {
      languageName: 'Maithili',
      languageType: 'Maithili'
    },
    {
      languageName: '马拉加斯语',
      languageType: 'Malagasy'
    },
    {
      languageName: '毛利语',
      languageType: 'Te Reo Māori'
    },
    {
      languageName: '马其顿语',
      languageType: 'Македонски'
    },
    {
      languageName: '马拉雅拉姆语',
      languageType: 'മലയാളം'
    },
    {
      languageName: 'Mongolian(Cyrillic)',
      languageType: 'Mongolian (Cyrillic)'
    },
    {
      languageName: 'Mongolian(Traditional)',
      languageType: 'ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ'
    },
    {
      languageName: '马拉地语',
      languageType: 'मराठी'
    },
    {
      languageName: '马来语',
      languageType: 'Melayu'
    },
    {
      languageName: '马耳他语',
      languageType: 'Malti'
    },
    {
      languageName: '苗语',
      languageType: 'Hmong Daw'
    },
    {
      languageName: '缅甸语',
      languageType: 'မြန်မာ'
    },
    {
      languageName: '书面挪威语',
      languageType: 'Norsk Bokmål'
    },
    {
      languageName: '尼泊尔语',
      languageType: 'नेपाली'
    },
    {
      languageName: '荷兰语',
      languageType: 'Nederlands'
    },
    {
      languageName: 'Sesotho sa Leboa',
      languageType: 'Sesotho sa Leboa'
    },
    {
      languageName: 'Nyanja',
      languageType: 'Nyanja'
    },
    {
      languageName: '奥里亚语',
      languageType: 'ଓଡ଼ିଆ'
    },
    {
      languageName: '克雷塔罗奥托米语',
      languageType: 'Hñähñu'
    },
    {
      languageName: '旁遮普语',
      languageType: 'ਪੰਜਾਬੀ'
    },
    {
      languageName: '波兰语',
      languageType: 'Polski'
    },
    {
      languageName: '达里语',
      languageType: 'دری'
    },
    {
      languageName: '普什图语',
      languageType: 'پښتو'
    },
    {
      languageName: '葡萄牙语(巴西)',
      languageType: 'Português (Brasil)'
    },
    {
      languageName: '葡萄牙语(葡萄牙)',
      languageType: 'Português (Portugal)'
    },
    {
      languageName: '罗马尼亚语',
      languageType: 'Română'
    },
    {
      languageName: 'Rundi',
      languageType: 'Rundi'
    },
    {
      languageName: 'Kinyarwanda',
      languageType: 'Kinyarwanda'
    },
    {
      languageName: 'Sindhi',
      languageType: 'سنڌي'
    },
    {
      languageName: 'Sinhala',
      languageType: 'සිංහල'
    },
    {
      languageName: '斯洛伐克语',
      languageType: 'Slovenčina'
    },
    {
      languageName: '斯洛文尼亚语',
      languageType: 'Slovenščina'
    },
    {
      languageName: '萨摩亚语',
      languageType: 'Gagana Sāmoa'
    },
    {
      languageName: '绍纳语',
      languageType: 'chiShona'
    },
    {
      languageName: '索马里语',
      languageType: 'Soomaali'
    },
    {
      languageName: '阿尔巴尼亚语',
      languageType: 'Shqip'
    },
    {
      languageName: '塞尔维亚语(西里尔文)',
      languageType: 'Српски (ћирилица)'
    },
    {
      languageName: '塞尔维亚语(拉丁文)',
      languageType: 'Srpski (latinica)'
    },
    {
      languageName: 'Sesotho',
      languageType: 'Sesotho'
    },
    {
      languageName: '瑞典语',
      languageType: 'Svenska'
    },
    {
      languageName: '斯瓦希里语',
      languageType: 'Kiswahili'
    },
    {
      languageName: '泰米尔语',
      languageType: 'தமிழ்'
    },
    {
      languageName: '泰卢固语',
      languageType: 'తెలుగు'
    },
    {
      languageName: '泰语',
      languageType: 'ไทย'
    },
    {
      languageName: '提格利尼亚语',
      languageType: 'ትግር'
    },
    {
      languageName: '土库曼语',
      languageType: 'Türkmen Dili'
    },
    {
      languageName: '克林贡语(拉丁文)',
      languageType: 'Klingon (Latin)'
    },
    {
      languageName: '克林贡语(pIqaD)',
      languageType: 'Klingon (pIqaD)'
    },
    {
      languageName: 'Setswana',
      languageType: 'Setswana'
    },
    {
      languageName: '汤加语',
      languageType: 'Lea Fakatonga'
    },
    {
      languageName: '土耳其语',
      languageType: 'Türkçe'
    },
    {
      languageName: '鞑靼语',
      languageType: 'Татар'
    },
    {
      languageName: '塔希提语',
      languageType: 'Reo Tahiti'
    },
    {
      languageName: '维吾尔语',
      languageType: 'ئۇيغۇرچە'
    },
    {
      languageName: '乌克兰语',
      languageType: 'Українська'
    },
    {
      languageName: '乌尔都语',
      languageType: 'اردو'
    },
    {
      languageName: '乌兹别克语',
      languageType: 'Uzbek (Latin)'
    },
    {
      languageName: '越南语',
      languageType: 'Tiếng Việt'
    },
    {
      languageName: '科萨语',
      languageType: 'isiXhosa'
    },
    {
      languageName: 'Yoruba',
      languageType: 'Èdè Yorùbá'
    },
    {
      languageName: '尤卡特克玛雅语',
      languageType: 'Yucatec Maya'
    },
    {
      languageName: '祖鲁语',
      languageType: 'Isi-Zulu'
    }
  ]
}
