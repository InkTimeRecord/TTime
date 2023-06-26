export default {
  name: '阿里云翻译',
  // 是否需要秘钥
  isKey: true,
  // 是否单秘钥
  isOneAppKey: false,
  // 翻译语言
  languageList: [
    {
      languageName: '中文(简体)',
      languageType: 'zh'
    },
    {
      languageName: '中文(繁体)',
      languageType: 'zh-tw'
    },
    {
      languageName: '中文(粤语)',
      languageType: 'yue'
    },
    {
      languageName: '英语',
      languageType: 'en'
    },
    {
      languageName: '阿布哈兹语',
      languageType: 'ab'
    },
    {
      languageName: '阿尔巴尼亚语',
      languageType: 'sq'
    },
    {
      languageName: '阿肯语',
      languageType: 'ak'
    },
    {
      languageName: '阿拉伯语',
      languageType: 'ar'
    },
    {
      languageName: '阿拉贡语',
      languageType: 'an'
    },
    {
      languageName: '阿姆哈拉语',
      languageType: 'am'
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
      languageName: '阿斯图里亚斯语',
      languageType: 'ast'
    },
    {
      languageName: '阿兹特克语',
      languageType: 'nch'
    },
    {
      languageName: '埃维语',
      languageType: 'ee'
    },
    {
      languageName: '艾马拉语',
      languageType: 'ay'
    },
    {
      languageName: '爱尔兰语',
      languageType: 'ga'
    },
    {
      languageName: '爱沙尼亚语',
      languageType: 'et'
    },
    {
      languageName: '奥杰布瓦语',
      languageType: 'oj'
    },
    {
      languageName: '奥克语',
      languageType: 'oc'
    },
    {
      languageName: '奥里亚语',
      languageType: 'or'
    },
    {
      languageName: '奥罗莫语',
      languageType: 'om'
    },
    {
      languageName: '奥塞梯语',
      languageType: 'os'
    },
    {
      languageName: '巴布亚皮钦语',
      languageType: 'tpi'
    },
    {
      languageName: '巴什基尔语',
      languageType: 'ba'
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
      languageName: '柏柏尔语',
      languageType: 'ber'
    },
    {
      languageName: '班巴拉语',
      languageType: 'bm'
    },
    {
      languageName: '邦阿西楠语',
      languageType: 'pag'
    },
    {
      languageName: '保加利亚语',
      languageType: 'bg'
    },
    {
      languageName: '北萨米语',
      languageType: 'se'
    },
    {
      languageName: '本巴语',
      languageType: 'bem'
    },
    {
      languageName: '比林语',
      languageType: 'byn'
    },
    {
      languageName: '比斯拉马语',
      languageType: 'bi'
    },
    {
      languageName: '俾路支语',
      languageType: 'bal'
    },
    {
      languageName: '冰岛语',
      languageType: 'is'
    },
    {
      languageName: '波兰语',
      languageType: 'pl'
    },
    {
      languageName: '波斯尼亚语',
      languageType: 'bs'
    },
    {
      languageName: '波斯语',
      languageType: 'fa'
    },
    {
      languageName: '博杰普尔语',
      languageType: 'bho'
    },
    {
      languageName: '布列塔尼语',
      languageType: 'br'
    },
    {
      languageName: '查莫罗语',
      languageType: 'ch'
    },
    {
      languageName: '查瓦卡诺语',
      languageType: 'cbk'
    },
    {
      languageName: '楚瓦什语',
      languageType: 'cv'
    },
    {
      languageName: '聪加语',
      languageType: 'ts'
    },
    {
      languageName: '鞑靼语',
      languageType: 'tt'
    },
    {
      languageName: '丹麦语',
      languageType: 'da'
    },
    {
      languageName: '掸语',
      languageType: 'shn'
    },
    {
      languageName: '德顿语',
      languageType: 'tet'
    },
    {
      languageName: '德语',
      languageType: 'de'
    },
    {
      languageName: '低地德语',
      languageType: 'nds'
    },
    {
      languageName: '低地苏格兰语',
      languageType: 'sco'
    },
    {
      languageName: '迪维西语',
      languageType: 'dv'
    },
    {
      languageName: '侗语',
      languageType: 'kdx'
    },
    {
      languageName: '杜順語',
      languageType: 'dtp'
    },
    {
      languageName: '俄语',
      languageType: 'ru'
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
      languageName: '梵语',
      languageType: 'sa'
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
      languageName: '芬兰语',
      languageType: 'fi'
    },
    {
      languageName: '弗留利语',
      languageType: 'fur'
    },
    {
      languageName: '富尔语',
      languageType: 'fvr'
    },
    {
      languageName: '刚果语',
      languageType: 'kg'
    },
    {
      languageName: '高棉语',
      languageType: 'km'
    },
    {
      languageName: '格雷罗纳瓦特尔语',
      languageType: 'ngu'
    },
    {
      languageName: '格陵兰语',
      languageType: 'kl'
    },
    {
      languageName: '格鲁吉亚语',
      languageType: 'ka'
    },
    {
      languageName: '格罗宁根方言',
      languageType: 'gos'
    },
    {
      languageName: '古吉拉特语',
      languageType: 'gu'
    },
    {
      languageName: '瓜拉尼语',
      languageType: 'gn'
    },
    {
      languageName: '哈萨克语',
      languageType: 'kk'
    },
    {
      languageName: '海地克里奥尔语',
      languageType: 'ht'
    },
    {
      languageName: '韩语',
      languageType: 'ko'
    },
    {
      languageName: '豪萨语',
      languageType: 'ha'
    },
    {
      languageName: '荷兰语',
      languageType: 'nl'
    },
    {
      languageName: '黑山语',
      languageType: 'cnr'
    },
    {
      languageName: '胡帕语',
      languageType: 'hup'
    },
    {
      languageName: '基里巴斯语',
      languageType: 'gil'
    },
    {
      languageName: '基隆迪语',
      languageType: 'rn'
    },
    {
      languageName: '基切语',
      languageType: 'quc'
    },
    {
      languageName: '吉尔吉斯斯坦语',
      languageType: 'ky'
    },
    {
      languageName: '加利西亚语',
      languageType: 'gl'
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
      languageName: '卡拜尔语',
      languageType: 'kab'
    },
    {
      languageName: '卡纳达语',
      languageType: 'kn'
    },
    {
      languageName: '卡努里语',
      languageType: 'kr'
    },
    {
      languageName: '卡舒比语',
      languageType: 'csb'
    },
    {
      languageName: '卡西语',
      languageType: 'kha'
    },
    {
      languageName: '康沃尔语',
      languageType: 'kw'
    },
    {
      languageName: '科萨语',
      languageType: 'xh'
    },
    {
      languageName: '科西嘉语',
      languageType: 'co'
    },
    {
      languageName: '克里克语',
      languageType: 'mus'
    },
    {
      languageName: '克里米亚鞑靼语',
      languageType: 'crh'
    },
    {
      languageName: '克林贡语',
      languageType: 'tlh'
    },
    {
      languageName: '克罗地亚语',
      languageType: 'hbs'
    },
    {
      languageName: '克丘亚语',
      languageType: 'qu'
    },
    {
      languageName: '克什米尔语',
      languageType: 'ks'
    },
    {
      languageName: '库尔德语',
      languageType: 'ku'
    },
    {
      languageName: '拉丁语',
      languageType: 'la'
    },
    {
      languageName: '拉特加莱语',
      languageType: 'ltg'
    },
    {
      languageName: '拉脱维亚语',
      languageType: 'lv'
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
      languageName: '林堡语',
      languageType: 'li'
    },
    {
      languageName: '林加拉语',
      languageType: 'ln'
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
      languageName: '卢森尼亚语',
      languageType: 'rue'
    },
    {
      languageName: '卢旺达语',
      languageType: 'rw'
    },
    {
      languageName: '罗马尼亚语',
      languageType: 'ro'
    },
    {
      languageName: '罗曼什语',
      languageType: 'rm'
    },
    {
      languageName: '罗姆语',
      languageType: 'rom'
    },
    {
      languageName: '逻辑语',
      languageType: 'jbo'
    },
    {
      languageName: '马达加斯加语',
      languageType: 'mg'
    },
    {
      languageName: '马恩语',
      languageType: 'gv'
    },
    {
      languageName: '马耳他语',
      languageType: 'mt'
    },
    {
      languageName: '马拉地语',
      languageType: 'mr'
    },
    {
      languageName: '马拉雅拉姆语',
      languageType: 'ml'
    },
    {
      languageName: '马来语',
      languageType: 'ms'
    },
    {
      languageName: '马里语（俄罗斯）',
      languageType: 'chm'
    },
    {
      languageName: '马其顿语',
      languageType: 'mk'
    },
    {
      languageName: '马绍尔语',
      languageType: 'mh'
    },
    {
      languageName: '玛雅语',
      languageType: 'kek'
    },
    {
      languageName: '迈蒂利语',
      languageType: 'mai'
    },
    {
      languageName: '毛里求斯克里奥尔语',
      languageType: 'mfe'
    },
    {
      languageName: '毛利语',
      languageType: 'mi'
    },
    {
      languageName: '蒙古语',
      languageType: 'mn'
    },
    {
      languageName: '孟加拉语',
      languageType: 'bn'
    },
    {
      languageName: '缅甸语',
      languageType: 'my'
    },
    {
      languageName: '苗语',
      languageType: 'hmn'
    },
    {
      languageName: '姆班杜语',
      languageType: 'umb'
    },
    {
      languageName: '纳瓦霍语',
      languageType: 'nv'
    },
    {
      languageName: '南非语',
      languageType: 'af'
    },
    {
      languageName: '尼泊尔语',
      languageType: 'ne'
    },
    {
      languageName: '纽埃语',
      languageType: 'niu'
    },
    {
      languageName: '挪威语',
      languageType: 'no'
    },
    {
      languageName: '帕姆语',
      languageType: 'pmn'
    },
    {
      languageName: '帕皮阿门托语',
      languageType: 'pap'
    },
    {
      languageName: '旁遮普语',
      languageType: 'pa'
    },
    {
      languageName: '葡萄牙语',
      languageType: 'pt'
    },
    {
      languageName: '普什图语',
      languageType: 'ps'
    },
    {
      languageName: '齐切瓦语',
      languageType: 'ny'
    },
    {
      languageName: '契维语',
      languageType: 'tw'
    },
    {
      languageName: '切罗基语',
      languageType: 'chr'
    },
    {
      languageName: '日语',
      languageType: 'ja'
    },
    {
      languageName: '瑞典语',
      languageType: 'sv'
    },
    {
      languageName: '萨摩亚语',
      languageType: 'sm'
    },
    {
      languageName: '桑戈语',
      languageType: 'sg'
    },
    {
      languageName: '僧伽罗语',
      languageType: 'si'
    },
    {
      languageName: '上索布语',
      languageType: 'hsb'
    },
    {
      languageName: '世界语',
      languageType: 'eo'
    },
    {
      languageName: '斯洛文尼亚语',
      languageType: 'sl'
    },
    {
      languageName: '斯瓦希里语',
      languageType: 'sw'
    },
    {
      languageName: '索马里语',
      languageType: 'so'
    },
    {
      languageName: '斯洛伐克语',
      languageType: 'sk'
    },
    {
      languageName: '他加禄语',
      languageType: 'tl'
    },
    {
      languageName: '塔吉克语',
      languageType: 'tg'
    },
    {
      languageName: '塔希提语',
      languageType: 'ty'
    },
    {
      languageName: '泰卢固语',
      languageType: 'te'
    },
    {
      languageName: '泰米尔语',
      languageType: 'ta'
    },
    {
      languageName: '泰语',
      languageType: 'th'
    },
    {
      languageName: '汤加语（汤加群岛）',
      languageType: 'to'
    },
    {
      languageName: '汤加语（赞比亚）',
      languageType: 'toi'
    },
    {
      languageName: '提格雷尼亚语',
      languageType: 'ti'
    },
    {
      languageName: '图瓦卢语',
      languageType: 'tvl'
    },
    {
      languageName: '图瓦语',
      languageType: 'tyv'
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
      languageName: '瓦隆语',
      languageType: 'wa'
    },
    {
      languageName: '瓦瑞语（菲律宾）',
      languageType: 'war'
    },
    {
      languageName: '威尔士语',
      languageType: 'cy'
    },
    {
      languageName: '文达语',
      languageType: 've'
    },
    {
      languageName: '沃拉普克语',
      languageType: 'vo'
    },
    {
      languageName: '沃洛夫语',
      languageType: 'wo'
    },
    {
      languageName: '乌德穆尔特语',
      languageType: 'udm'
    },
    {
      languageName: '乌尔都语',
      languageType: 'ur'
    },
    {
      languageName: '乌孜别克语',
      languageType: 'uz'
    },
    {
      languageName: '西班牙语',
      languageType: 'es'
    },
    {
      languageName: '西方国际语',
      languageType: 'ie'
    },
    {
      languageName: '西弗里斯兰语',
      languageType: 'fy'
    },
    {
      languageName: '西里西亚语',
      languageType: 'szl'
    },
    {
      languageName: '希伯来语',
      languageType: 'he'
    },
    {
      languageName: '希利盖农语',
      languageType: 'hil'
    },
    {
      languageName: '夏威夷语',
      languageType: 'haw'
    },
    {
      languageName: '现代希腊语',
      languageType: 'el'
    },
    {
      languageName: '新共同语言',
      languageType: 'lfn'
    },
    {
      languageName: '信德语',
      languageType: 'sd'
    },
    {
      languageName: '匈牙利语',
      languageType: 'hu'
    },
    {
      languageName: '修纳语',
      languageType: 'sn'
    },
    {
      languageName: '宿务语',
      languageType: 'ceb'
    },
    {
      languageName: '叙利亚语',
      languageType: 'syr'
    },
    {
      languageName: '巽他语',
      languageType: 'su'
    },
    {
      languageName: '亚美尼亚语',
      languageType: 'hy'
    },
    {
      languageName: '亚齐语',
      languageType: 'ace'
    },
    {
      languageName: '伊班语',
      languageType: 'iba'
    },
    {
      languageName: '伊博语',
      languageType: 'ig'
    },
    {
      languageName: '伊多语',
      languageType: 'io'
    },
    {
      languageName: '伊洛卡诺语',
      languageType: 'ilo'
    },
    {
      languageName: '伊努克提图特语',
      languageType: 'iu'
    },
    {
      languageName: '意大利语',
      languageType: 'it'
    },
    {
      languageName: '意第绪语',
      languageType: 'yi'
    },
    {
      languageName: '因特语',
      languageType: 'ia'
    },
    {
      languageName: '印地语',
      languageType: 'hi'
    },
    {
      languageName: '印度尼西亚语',
      languageType: 'id'
    },
    {
      languageName: '印古什语',
      languageType: 'inh'
    },
    {
      languageName: '约鲁巴语',
      languageType: 'yo'
    },
    {
      languageName: '越南语',
      languageType: 'vi'
    },
    {
      languageName: '扎扎其语',
      languageType: 'zza'
    },
    {
      languageName: '爪哇语',
      languageType: 'jv'
    },
    {
      languageName: '祖鲁语',
      languageType: 'zu'
    }
  ]
}
