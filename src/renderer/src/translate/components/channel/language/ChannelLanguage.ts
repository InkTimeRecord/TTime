import { TranslateServiceEnum } from '../../../../enums/TranslateServiceEnum'
import { getTranslateServiceMapByUse } from '../../../../utils/translateServiceUtil'

const languageMap = new Map()

const TTimeLanguageListOld = [
  {
    languageName: '中文(简体)',
    languageType: 'zh'
  },
  {
    languageName: '中文(繁体)',
    languageType: 'cht'
  },
  {
    languageName: '中文(文言文)',
    languageType: 'wyw'
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
    languageName: '日语',
    languageType: 'jp'
  },
  {
    languageName: '俄语',
    languageType: 'ru'
  },
  {
    languageName: '法语',
    languageType: 'fra'
  },
  {
    languageName: '韩语',
    languageType: 'kor'
  },
  {
    languageName: '马来语',
    languageType: 'may'
  },
  {
    languageName: '老挝语',
    languageType: 'lao'
  },
  {
    languageName: '印度尼西亚语',
    languageType: 'id'
  },
  {
    languageName: '意大利语',
    languageType: 'it'
  },
  {
    languageName: '越南语',
    languageType: 'vie'
  },
  {
    languageName: '西班牙语',
    languageType: 'spa'
  },
  {
    languageName: '乌克兰语',
    languageType: 'ukr'
  },
  {
    languageName: '泰语',
    languageType: 'th'
  },
  {
    languageName: '土耳其语',
    languageType: 'tr'
  },
  {
    languageName: '阿拉伯语',
    languageType: 'ara'
  },
  {
    languageName: '爱尔兰语',
    languageType: 'gle'
  },
  {
    languageName: '奥克语',
    languageType: 'oci'
  },
  {
    languageName: '阿尔巴尼亚语',
    languageType: 'alb'
  },
  {
    languageName: '阿尔及利亚阿拉伯语',
    languageType: 'arq'
  },
  {
    languageName: '阿肯语',
    languageType: 'aka'
  },
  {
    languageName: '阿拉贡语',
    languageType: 'arg'
  },
  {
    languageName: '阿姆哈拉语',
    languageType: 'amh'
  },
  {
    languageName: '阿萨姆语',
    languageType: 'asm'
  },
  {
    languageName: '艾马拉语',
    languageType: 'aym'
  },
  {
    languageName: '阿塞拜疆语',
    languageType: 'aze'
  },
  {
    languageName: '阿斯图里亚斯语',
    languageType: 'ast'
  },
  {
    languageName: '奥塞梯语',
    languageType: 'oss'
  },
  {
    languageName: '爱沙尼亚语',
    languageType: 'est'
  },
  {
    languageName: '奥杰布瓦语',
    languageType: 'oji'
  },
  {
    languageName: '奥里亚语',
    languageType: 'ori'
  },
  {
    languageName: '奥罗莫语',
    languageType: 'orm'
  },
  {
    languageName: '波兰语',
    languageType: 'pl'
  },
  {
    languageName: '波斯语',
    languageType: 'per'
  },
  {
    languageName: '布列塔尼语',
    languageType: 'bre'
  },
  {
    languageName: '巴什基尔语',
    languageType: 'bak'
  },
  {
    languageName: '巴斯克语',
    languageType: 'baq'
  },
  {
    languageName: '巴西葡萄牙语',
    languageType: 'pot'
  },
  {
    languageName: '白俄罗斯语',
    languageType: 'bel'
  },
  {
    languageName: '柏柏尔语',
    languageType: 'ber'
  },
  {
    languageName: '邦板牙语',
    languageType: 'pam'
  },
  {
    languageName: '保加利亚语',
    languageType: 'bul'
  },
  {
    languageName: '北方萨米语',
    languageType: 'sme'
  },
  {
    languageName: '北索托语',
    languageType: 'ped'
  },
  {
    languageName: '本巴语',
    languageType: 'bem'
  },
  {
    languageName: '比林语',
    languageType: 'bli'
  },
  {
    languageName: '比斯拉马语',
    languageType: 'bis'
  },
  {
    languageName: '俾路支语',
    languageType: 'bal'
  },
  {
    languageName: '冰岛语',
    languageType: 'ice'
  },
  {
    languageName: '波斯尼亚语',
    languageType: 'bos'
  },
  {
    languageName: '博杰普尔语',
    languageType: 'bho'
  },
  {
    languageName: '楚瓦什语',
    languageType: 'chv'
  },
  {
    languageName: '聪加语',
    languageType: 'tso'
  },
  {
    languageName: '丹麦语',
    languageType: 'dan'
  },
  {
    languageName: '德语',
    languageType: 'de'
  },
  {
    languageName: '鞑靼语',
    languageType: 'tat'
  },
  {
    languageName: '掸语',
    languageType: 'sha'
  },
  {
    languageName: '德顿语',
    languageType: 'tet'
  },
  {
    languageName: '迪维希语',
    languageType: 'div'
  },
  {
    languageName: '低地德语',
    languageType: 'log'
  },
  {
    languageName: '菲律宾语',
    languageType: 'fil'
  },
  {
    languageName: '芬兰语',
    languageType: 'fin'
  },
  {
    languageName: '梵语',
    languageType: 'san'
  },
  {
    languageName: '弗留利语',
    languageType: 'fri'
  },
  {
    languageName: '富拉尼语',
    languageType: 'ful'
  },
  {
    languageName: '法罗语',
    languageType: 'fao'
  },
  {
    languageName: '盖尔语',
    languageType: 'gla'
  },
  {
    languageName: '刚果语',
    languageType: 'kon'
  },
  {
    languageName: '高地索布语',
    languageType: 'ups'
  },
  {
    languageName: '高棉语',
    languageType: 'hkm'
  },
  {
    languageName: '格陵兰语',
    languageType: 'kal'
  },
  {
    languageName: '格鲁吉亚语',
    languageType: 'geo'
  },
  {
    languageName: '古吉拉特语',
    languageType: 'guj'
  },
  {
    languageName: '古希腊语',
    languageType: 'gra'
  },
  {
    languageName: '古英语',
    languageType: 'eno'
  },
  {
    languageName: '瓜拉尼语',
    languageType: 'grn'
  },
  {
    languageName: '荷兰语',
    languageType: 'nl'
  },
  {
    languageName: '胡帕语',
    languageType: 'hup'
  },
  {
    languageName: '哈卡钦语',
    languageType: 'hak'
  },
  {
    languageName: '海地语',
    languageType: 'ht'
  },
  {
    languageName: '黑山语',
    languageType: 'mot'
  },
  {
    languageName: '豪萨语',
    languageType: 'hau'
  },
  {
    languageName: '吉尔吉斯语',
    languageType: 'kir'
  },
  {
    languageName: '加利西亚语',
    languageType: 'glg'
  },
  {
    languageName: '加拿大法语',
    languageType: 'frn'
  },
  {
    languageName: '加泰罗尼亚语',
    languageType: 'cat'
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
    languageType: 'kan'
  },
  {
    languageName: '卡努里语',
    languageType: 'kau'
  },
  {
    languageName: '卡舒比语',
    languageType: 'kah'
  },
  {
    languageName: '康瓦尔语',
    languageType: 'cor'
  },
  {
    languageName: '科萨语',
    languageType: 'xho'
  },
  {
    languageName: '科西嘉语',
    languageType: 'cos'
  },
  {
    languageName: '克里克语',
    languageType: 'cre'
  },
  {
    languageName: '克里米亚鞑靼语',
    languageType: 'cri'
  },
  {
    languageName: '克林贡语',
    languageType: 'kli'
  },
  {
    languageName: '克罗地亚语',
    languageType: 'hrv'
  },
  {
    languageName: '克丘亚语',
    languageType: 'que'
  },
  {
    languageName: '克什米尔语',
    languageType: 'kas'
  },
  {
    languageName: '孔卡尼语',
    languageType: 'kok'
  },
  {
    languageName: '库尔德语',
    languageType: 'kur'
  },
  {
    languageName: '拉丁语',
    languageType: 'lat'
  },
  {
    languageName: '罗马尼亚语',
    languageType: 'rom'
  },
  {
    languageName: '拉特加莱语',
    languageType: 'lag'
  },
  {
    languageName: '拉脱维亚语',
    languageType: 'lav'
  },
  {
    languageName: '林堡语',
    languageType: 'lim'
  },
  {
    languageName: '林加拉语',
    languageType: 'lin'
  },
  {
    languageName: '卢干达语',
    languageType: 'lug'
  },
  {
    languageName: '卢森堡语',
    languageType: 'ltz'
  },
  {
    languageName: '卢森尼亚语',
    languageType: 'ruy'
  },
  {
    languageName: '卢旺达语',
    languageType: 'kin'
  },
  {
    languageName: '立陶宛语',
    languageType: 'lit'
  },
  {
    languageName: '罗曼什语',
    languageType: 'roh'
  },
  {
    languageName: '罗姆语',
    languageType: 'ro'
  },
  {
    languageName: '逻辑语',
    languageType: 'loj'
  },
  {
    languageName: '缅甸语',
    languageType: 'bur'
  },
  {
    languageName: '马拉地语',
    languageType: 'mar'
  },
  {
    languageName: '马拉加斯语',
    languageType: 'mg'
  },
  {
    languageName: '马拉雅拉姆语',
    languageType: 'mal'
  },
  {
    languageName: '马其顿语',
    languageType: 'mac'
  },
  {
    languageName: '马绍尔语',
    languageType: 'mah'
  },
  {
    languageName: '迈蒂利语',
    languageType: 'mai'
  },
  {
    languageName: '曼克斯语',
    languageType: 'glv'
  },
  {
    languageName: '毛里求斯克里奥尔语',
    languageType: 'mau'
  },
  {
    languageName: '毛利语',
    languageType: 'mao'
  },
  {
    languageName: '孟加拉语',
    languageType: 'ben'
  },
  {
    languageName: '马耳他语',
    languageType: 'mlt'
  },
  {
    languageName: '苗语',
    languageType: 'hmn'
  },
  {
    languageName: '挪威语',
    languageType: 'nor'
  },
  {
    languageName: '那不勒斯语',
    languageType: 'nea'
  },
  {
    languageName: '南恩德贝莱语',
    languageType: 'nbl'
  },
  {
    languageName: '南非荷兰语',
    languageType: 'afr'
  },
  {
    languageName: '南索托语',
    languageType: 'sot'
  },
  {
    languageName: '尼泊尔语',
    languageType: 'nep'
  },
  {
    languageName: '葡萄牙语',
    languageType: 'pt'
  },
  {
    languageName: '旁遮普语',
    languageType: 'pan'
  },
  {
    languageName: '帕皮阿门托语',
    languageType: 'pap'
  },
  {
    languageName: '普什图语',
    languageType: 'pus'
  },
  {
    languageName: '齐切瓦语',
    languageType: 'nya'
  },
  {
    languageName: '契维语',
    languageType: 'twi'
  },
  {
    languageName: '切罗基语',
    languageType: 'chr'
  },
  {
    languageName: '瑞典语',
    languageType: 'swe'
  },
  {
    languageName: '萨丁尼亚语',
    languageType: 'srd'
  },
  {
    languageName: '萨摩亚语',
    languageType: 'sm'
  },
  {
    languageName: '塞尔维亚-克罗地亚语',
    languageType: 'sec'
  },
  {
    languageName: '塞尔维亚语',
    languageType: 'srp'
  },
  {
    languageName: '桑海语',
    languageType: 'sol'
  },
  {
    languageName: '僧伽罗语',
    languageType: 'sin'
  },
  {
    languageName: '世界语',
    languageType: 'epo'
  },
  {
    languageName: '书面挪威语',
    languageType: 'nob'
  },
  {
    languageName: '斯洛伐克语',
    languageType: 'sk'
  },
  {
    languageName: '斯洛文尼亚语',
    languageType: 'slo'
  },
  {
    languageName: '斯瓦希里语',
    languageType: 'swa'
  },
  {
    languageName: '塞尔维亚语(西里尔)',
    languageType: 'src'
  },
  {
    languageName: '索马里语',
    languageType: 'som'
  },
  {
    languageName: '塔吉克语',
    languageType: 'tgk'
  },
  {
    languageName: '泰米尔语',
    languageType: 'tam'
  },
  {
    languageName: '他加禄语',
    languageType: 'tgl'
  },
  {
    languageName: '提格利尼亚语',
    languageType: 'tir'
  },
  {
    languageName: '泰卢固语',
    languageType: 'tel'
  },
  {
    languageName: '突尼斯阿拉伯语',
    languageType: 'tua'
  },
  {
    languageName: '土库曼语',
    languageType: 'tuk'
  },
  {
    languageName: '瓦隆语',
    languageType: 'wln'
  },
  {
    languageName: '威尔士语',
    languageType: 'wel'
  },
  {
    languageName: '文达语',
    languageType: 'ven'
  },
  {
    languageName: '沃洛夫语',
    languageType: 'wol'
  },
  {
    languageName: '乌尔都语',
    languageType: 'urd'
  },
  {
    languageName: '希伯来语',
    languageType: 'heb'
  },
  {
    languageName: '希腊语',
    languageType: 'el'
  },
  {
    languageName: '匈牙利语',
    languageType: 'hu'
  },
  {
    languageName: '西弗里斯语',
    languageType: 'fry'
  },
  {
    languageName: '西里西亚语',
    languageType: 'sil'
  },
  {
    languageName: '希利盖农语',
    languageType: 'hil'
  },
  {
    languageName: '下索布语',
    languageType: 'los'
  },
  {
    languageName: '夏威夷语',
    languageType: 'haw'
  },
  {
    languageName: '新挪威语',
    languageType: 'nno'
  },
  {
    languageName: '西非书面语',
    languageType: 'nqo'
  },
  {
    languageName: '信德语',
    languageType: 'snd'
  },
  {
    languageName: '修纳语',
    languageType: 'sna'
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
    languageType: 'sun'
  },
  {
    languageName: '印地语',
    languageType: 'hi'
  },
  {
    languageName: '意第绪语',
    languageType: 'yid'
  },
  {
    languageName: '因特语',
    languageType: 'ina'
  },
  {
    languageName: '亚齐语',
    languageType: 'ach'
  },
  {
    languageName: '印古什语',
    languageType: 'ing'
  },
  {
    languageName: '伊博语',
    languageType: 'ibo'
  },
  {
    languageName: '伊多语',
    languageType: 'ido'
  },
  {
    languageName: '约鲁巴语',
    languageType: 'yor'
  },
  {
    languageName: '亚美尼亚语',
    languageType: 'arm'
  },
  {
    languageName: '伊努克提图特语',
    languageType: 'iku'
  },
  {
    languageName: '伊朗语',
    languageType: 'ir'
  },
  {
    languageName: '扎扎其语',
    languageType: 'zaz'
  },
  {
    languageName: '中古法语',
    languageType: 'frm'
  },
  {
    languageName: '祖鲁语',
    languageType: 'zul'
  },
  {
    languageName: '爪哇语',
    languageType: 'jav'
  }
]
const BaiduLanguageListOld = TTimeLanguageListOld
const AliyunLanguageListOld = [
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
    languageName: '英语',
    languageType: 'en'
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
    languageName: '祖鲁语',
    languageType: 'zu'
  }
]
const TencentCloudLanguageListOld = [
  {
    languageName: '中文(简体)',
    languageType: 'zh'
  },
  {
    languageName: '中文(繁体)',
    languageType: 'zh-TW'
  },
  {
    languageName: '英语',
    languageType: 'en'
  },
  {
    languageName: '日语',
    languageType: 'ja'
  },
  {
    languageName: '韩语',
    languageType: 'ko'
  },
  {
    languageName: '法语',
    languageType: 'fr'
  },
  {
    languageName: '西班牙语',
    languageType: 'es'
  },
  {
    languageName: '意大利语',
    languageType: 'it'
  },
  {
    languageName: '德语',
    languageType: 'de'
  },
  {
    languageName: '土耳其语',
    languageType: 'tr'
  },
  {
    languageName: '俄语',
    languageType: 'ru'
  },
  {
    languageName: '葡萄牙语',
    languageType: 'pt'
  },
  {
    languageName: '越南语',
    languageType: 'vi'
  },
  {
    languageName: '印度尼西亚语',
    languageType: 'id'
  },
  {
    languageName: '泰语',
    languageType: 'th'
  },
  {
    languageName: '马来语',
    languageType: 'ms'
  },
  {
    languageName: '阿拉伯语',
    languageType: 'ar'
  },
  {
    languageName: '印地语',
    languageType: 'hi'
  }
]
const GoogleLanguageListOld = [
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
const YouDaoLanguageListOld = [
  {
    languageName: '中文(简体)',
    languageType: 'zh-CHS'
  },
  {
    languageName: '中文(繁体)',
    languageType: 'zh-CHT'
  },
  {
    languageName: '英语',
    languageType: 'en'
  },
  {
    languageName: '日语',
    languageType: 'ja'
  },
  {
    languageName: '韩语',
    languageType: 'ko'
  },
  {
    languageName: '法语',
    languageType: 'fr'
  },
  {
    languageName: '西班牙语',
    languageType: 'es'
  },
  {
    languageName: '葡萄牙语',
    languageType: 'pt'
  },
  {
    languageName: '意大利语',
    languageType: 'it'
  },
  {
    languageName: '俄语',
    languageType: 'ru'
  },
  {
    languageName: '越南语',
    languageType: 'vi'
  },
  {
    languageName: '德语',
    languageType: 'de'
  },
  {
    languageName: '阿拉伯语',
    languageType: 'ar'
  },
  {
    languageName: '印尼语',
    languageType: 'id'
  },
  {
    languageName: '南非荷兰语',
    languageType: 'af'
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
    languageName: '粤语',
    languageType: 'yue'
  },
  {
    languageName: '加泰隆语',
    languageType: 'ca'
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
    languageName: '荷兰语',
    languageType: 'nl'
  },
  {
    languageName: '爱沙尼亚语',
    languageType: 'et'
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
    languageName: '希腊语',
    languageType: 'el'
  },
  {
    languageName: '海地克里奥尔语',
    languageType: 'ht'
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
    languageName: '白苗语',
    languageType: 'mww'
  },
  {
    languageName: '匈牙利语',
    languageType: 'hu'
  },
  {
    languageName: '斯瓦希里语',
    languageType: 'sw'
  },
  {
    languageName: '克林贡语',
    languageType: 'tlh'
  },
  {
    languageName: '拉脱维亚语',
    languageType: 'lv'
  },
  {
    languageName: '立陶宛语',
    languageType: 'lt'
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
    languageName: '挪威语',
    languageType: 'no'
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
    languageName: '克雷塔罗奥托米语',
    languageType: 'otq'
  },
  {
    languageName: '罗马尼亚语',
    languageType: 'ro'
  },
  {
    languageName: '塞尔维亚语(西里尔)',
    languageType: 'sr-Cyrl'
  },
  {
    languageName: '塞尔维亚语(拉丁文)',
    languageType: 'sr-Latn'
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
    languageName: '瑞典语',
    languageType: 'sv'
  },
  {
    languageName: '塔希提语',
    languageType: 'ty'
  },
  {
    languageName: '泰语',
    languageType: 'th'
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
    languageName: '乌克兰语',
    languageType: 'uk'
  },
  {
    languageName: '乌尔都语',
    languageType: 'ur'
  },
  {
    languageName: '威尔士语',
    languageType: 'cy'
  },
  {
    languageName: '尤卡坦玛雅语',
    languageType: 'yua'
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
    languageName: '亚美尼亚语',
    languageType: 'hy'
  },
  {
    languageName: '阿塞拜疆语',
    languageType: 'az'
  },
  {
    languageName: '孟加拉语',
    languageType: 'bn'
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
    languageName: '宿务语',
    languageType: 'ceb'
  },
  {
    languageName: '科西嘉语',
    languageType: 'co'
  },
  {
    languageName: '世界语',
    languageType: 'eo'
  },
  {
    languageName: '菲律宾语',
    languageType: 'tl'
  },
  {
    languageName: '弗里西语',
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
    languageName: '古吉拉特语',
    languageType: 'gu'
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
    languageName: '冰岛语',
    languageType: 'is'
  },
  {
    languageName: '伊博语',
    languageType: 'ig'
  },
  {
    languageName: '爱尔兰语',
    languageType: 'ga'
  },
  {
    languageName: '爪哇语',
    languageType: 'jw'
  },
  {
    languageName: '卡纳达语',
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
    languageName: '库尔德语',
    languageType: 'ku'
  },
  {
    languageName: '柯尔克孜语',
    languageType: 'ky'
  },
  {
    languageName: '老挝语',
    languageType: 'lo'
  },
  {
    languageName: '拉丁语',
    languageType: 'la'
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
    languageName: '马尔加什语',
    languageType: 'mg'
  },
  {
    languageName: '马拉雅拉姆语',
    languageType: 'ml'
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
    languageName: '蒙古语',
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
    languageName: '齐切瓦语',
    languageType: 'ny'
  },
  {
    languageName: '普什图语',
    languageType: 'ps'
  },
  {
    languageName: '旁遮普语',
    languageType: 'pa'
  },
  {
    languageName: '萨摩亚语',
    languageType: 'sm'
  },
  {
    languageName: '苏格兰盖尔语',
    languageType: 'gd'
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
    languageName: '索马里语',
    languageType: 'so'
  },
  {
    languageName: '巽他语',
    languageType: 'su'
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
    languageName: '泰卢固语',
    languageType: 'te'
  },
  {
    languageName: '乌兹别克语',
    languageType: 'uz'
  },
  {
    languageName: '南非科萨语',
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
    languageName: '南非祖鲁语',
    languageType: 'zu'
  }
]
const OpenAILanguageListOld = [
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
const DeepLLanguageListOld = [
  {
    languageName: '保加利亚语',
    languageType: 'BG'
  },
  {
    languageName: '捷克语',
    languageType: 'CS'
  },
  {
    languageName: '丹麦语',
    languageType: 'DA'
  },
  {
    languageName: '德语',
    languageType: 'DE'
  },
  {
    languageName: '希腊语',
    languageType: 'EL'
  },
  {
    languageName: '英语',
    languageType: 'EN'
  },
  {
    languageName: '西班牙语',
    languageType: 'ES'
  },
  {
    languageName: '爱沙尼亚语',
    languageType: 'ET'
  },
  {
    languageName: '芬兰语',
    languageType: 'FI'
  },
  {
    languageName: '法语',
    languageType: 'FR'
  },
  {
    languageName: '匈牙利语',
    languageType: 'HU'
  },
  {
    languageName: '印尼语',
    languageType: 'ID'
  },
  {
    languageName: '意大利语',
    languageType: 'IT'
  },
  {
    languageName: '日语',
    languageType: 'JA'
  },
  {
    languageName: '韩语',
    languageType: 'KO'
  },
  {
    languageName: '立陶宛语',
    languageType: 'LT'
  },
  {
    languageName: '拉脱维亚语',
    languageType: 'LV'
  },
  {
    languageName: '挪威语(Bokmål)',
    languageType: 'NB'
  },
  {
    languageName: '荷兰语',
    languageType: 'NL'
  },
  {
    languageName: '抛光',
    languageType: 'PL'
  },
  {
    languageName: '葡萄牙语（所有葡萄牙语品种混合）',
    languageType: 'PT'
  },
  {
    languageName: '罗马尼亚语',
    languageType: 'RO'
  },
  {
    languageName: '俄语',
    languageType: 'RU'
  },
  {
    languageName: '斯洛伐克语',
    languageType: 'SK'
  },
  {
    languageName: '斯洛文尼亚语',
    languageType: 'SL'
  },
  {
    languageName: '瑞典语',
    languageType: 'SV'
  },
  {
    languageName: '土耳其语',
    languageType: 'TR'
  },
  {
    languageName: '乌克兰语',
    languageType: 'UK'
  },
  {
    languageName: '中文(简体)',
    languageType: 'ZH'
  }
]
const VolcanoLanguageListOld = [
  { languageName: '中文(简体)', languageType: 'zh' },
  { languageName: '中文(繁体)', languageType: 'zh-Hant' },
  { languageName: '札那语', languageType: 'tn' },
  { languageName: '越南语', languageType: 'vi' },
  { languageName: '伊努克提图特语', languageType: 'iu' },
  { languageName: '意大利语', languageType: 'it' },
  { languageName: '印尼语', languageType: 'id' },
  { languageName: '印地语', languageType: 'hi' },
  { languageName: '英语', languageType: 'en' },
  { languageName: '希里莫图语', languageType: 'ho' },
  { languageName: '希伯来语', languageType: 'he' },
  { languageName: '西班牙语', languageType: 'es' },
  { languageName: '现代希腊语', languageType: 'el' },
  { languageName: '乌克兰语', languageType: 'uk' },
  { languageName: '乌尔都语', languageType: 'ur' },
  { languageName: '土库曼语', languageType: 'tk' },
  { languageName: '土耳其语', languageType: 'tr' },
  { languageName: '提格里尼亚语', languageType: 'ti' },
  { languageName: '塔希提语', languageType: 'ty' },
  { languageName: '他加禄语', languageType: 'tl' },
  { languageName: '汤加语', languageType: 'to' },
  { languageName: '泰语', languageType: 'th' },
  { languageName: '泰米尔语', languageType: 'ta' },
  { languageName: '泰卢固语', languageType: 'te' },
  { languageName: '斯洛文尼亚语', languageType: 'sl' },
  { languageName: '斯洛伐克语', languageType: 'sk' },
  { languageName: '史瓦帝语', languageType: 'ss' },
  { languageName: '世界语', languageType: 'eo' },
  { languageName: '萨摩亚语', languageType: 'sm' },
  { languageName: '桑戈语', languageType: 'sg' },
  { languageName: '塞索托语', languageType: 'st' },
  { languageName: '瑞典语', languageType: 'sv' },
  { languageName: '日语', languageType: 'ja' },
  { languageName: '契维语', languageType: 'tw' },
  { languageName: '奇楚瓦语', languageType: 'qu' },
  { languageName: '葡萄牙语', languageType: 'pt' },
  { languageName: '旁遮普语', languageType: 'pa' },
  { languageName: '挪威语', languageType: 'no' },
  { languageName: '挪威布克莫尔语', languageType: 'nb' },
  { languageName: '南恩德贝勒语', languageType: 'nr' },
  { languageName: '缅甸语', languageType: 'my' },
  { languageName: '孟加拉语', languageType: 'bn' },
  { languageName: '蒙古语', languageType: 'mn' },
  { languageName: '马绍尔语', languageType: 'mh' },
  { languageName: '马其顿语', languageType: 'mk' },
  { languageName: '马拉亚拉姆语', languageType: 'ml' },
  { languageName: '马拉提语', languageType: 'mr' },
  { languageName: '马来语', languageType: 'ms' },
  { languageName: '卢巴卡丹加语', languageType: 'lu' },
  { languageName: '罗马尼亚语', languageType: 'ro' },
  { languageName: '立陶宛语', languageType: 'lt' },
  { languageName: '拉脱维亚语', languageType: 'lv' },
  { languageName: '老挝语', languageType: 'lo' },
  { languageName: '宽亚玛语', languageType: 'kj' },
  { languageName: '克罗地亚语', languageType: 'hr' },
  { languageName: '坎纳达语', languageType: 'kn' },
  { languageName: '基库尤语', languageType: 'ki' },
  { languageName: '捷克语', languageType: 'cs' },
  { languageName: '加泰隆语', languageType: 'ca' },
  { languageName: '荷兰语', languageType: 'nl' },
  { languageName: '韩语', languageType: 'ko' },
  { languageName: '海地克里奥尔语', languageType: 'ht' },
  { languageName: '古吉拉特语', languageType: 'gu' },
  { languageName: '格鲁吉亚语', languageType: 'ka' },
  { languageName: '格陵兰语', languageType: 'kl' },
  { languageName: '高棉语', languageType: 'km' },
  { languageName: '干达语', languageType: 'lg' },
  { languageName: '刚果语', languageType: 'kg' },
  { languageName: '芬兰语', languageType: 'fi' },
  { languageName: '斐济语', languageType: 'fj' },
  { languageName: '法语', languageType: 'fr' },
  { languageName: '俄语', languageType: 'ru' },
  { languageName: '恩敦加语', languageType: 'ng' },
  { languageName: '德语', languageType: 'de' },
  { languageName: '鞑靼语', languageType: 'tt' },
  { languageName: '丹麦语', languageType: 'da' },
  { languageName: '聪加语', languageType: 'ts' },
  { languageName: '楚瓦什语', languageType: 'cv' },
  { languageName: '波斯语', languageType: 'fa' },
  { languageName: '波斯尼亚语', languageType: 'bs' },
  { languageName: '波兰语', languageType: 'pl' },
  { languageName: '比斯拉玛语', languageType: 'bi' },
  { languageName: '北恩德贝勒语', languageType: 'nd' },
  { languageName: '巴什基尔语', languageType: 'ba' },
  { languageName: '保加利亚语', languageType: 'bg' },
  { languageName: '阿塞拜疆语', languageType: 'az' },
  { languageName: '阿拉伯语', languageType: 'ar' },
  { languageName: '阿非利堪斯语', languageType: 'af' },
  { languageName: '阿尔巴尼亚语', languageType: 'sq' },
  { languageName: '阿布哈兹语', languageType: 'ab' },
  { languageName: '奥塞梯语', languageType: 'os' },
  { languageName: '埃维语', languageType: 'ee' },
  { languageName: '爱沙尼亚语', languageType: 'et' },
  { languageName: '艾马拉语', languageType: 'ay' },
  { languageName: '中文（文言文）', languageType: 'lzh' },
  { languageName: '阿姆哈拉语', languageType: 'am' },
  { languageName: '中库尔德语', languageType: 'ckb' },
  { languageName: '威尔士语', languageType: 'cy' },
  { languageName: '加利西亚语', languageType: 'gl' },
  { languageName: '豪萨语', languageType: 'ha' },
  { languageName: '亚美尼亚语', languageType: 'hy' },
  { languageName: '伊博语', languageType: 'ig' },
  { languageName: '北库尔德语', languageType: 'kmr' },
  { languageName: '林加拉语', languageType: 'ln' },
  { languageName: '北索托语', languageType: 'nso' },
  { languageName: '齐切瓦语', languageType: 'ny' },
  { languageName: '奥洛莫语', languageType: 'om' },
  { languageName: '绍纳语', languageType: 'sn' },
  { languageName: '索马里语', languageType: 'so' },
  { languageName: '塞尔维亚语', languageType: 'sr' },
  { languageName: '斯瓦希里语', languageType: 'sw' },
  { languageName: '科萨语', languageType: 'xh' },
  { languageName: '约鲁巴语', languageType: 'yo' },
  { languageName: '祖鲁语', languageType: 'zu' }
]
const BingLanguageListOld = [
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

languageMap.set(
  TranslateServiceEnum.TTIME,
  injectService(TTimeLanguageListOld, TranslateServiceEnum.TTIME)
)
languageMap.set(
  TranslateServiceEnum.BAIDU,
  injectService(BaiduLanguageListOld, TranslateServiceEnum.BAIDU)
)
languageMap.set(
  TranslateServiceEnum.ALIYUN,
  injectService(AliyunLanguageListOld, TranslateServiceEnum.ALIYUN)
)
languageMap.set(
  TranslateServiceEnum.TENCENT_CLOUD,
  injectService(TencentCloudLanguageListOld, TranslateServiceEnum.TENCENT_CLOUD)
)
languageMap.set(
  TranslateServiceEnum.GOOGLE,
  injectService(GoogleLanguageListOld, TranslateServiceEnum.GOOGLE)
)
languageMap.set(
  TranslateServiceEnum.GOOGLE_BUILT_IN,
  injectService(GoogleLanguageListOld, TranslateServiceEnum.GOOGLE_BUILT_IN)
)
languageMap.set(
  TranslateServiceEnum.YOU_DAO,
  injectService(YouDaoLanguageListOld, TranslateServiceEnum.YOU_DAO)
)
languageMap.set(
  TranslateServiceEnum.OPEN_AI,
  injectService(OpenAILanguageListOld, TranslateServiceEnum.OPEN_AI)
)
languageMap.set(
  TranslateServiceEnum.DEEP_L,
  injectService(DeepLLanguageListOld, TranslateServiceEnum.DEEP_L)
)
languageMap.set(
  TranslateServiceEnum.VOLCANO,
  injectService(VolcanoLanguageListOld, TranslateServiceEnum.VOLCANO)
)
languageMap.set(
  TranslateServiceEnum.BING,
  injectService(BingLanguageListOld, TranslateServiceEnum.BING)
)
languageMap.set(
  TranslateServiceEnum.BING_DICT,
  injectService(BingLanguageListOld, TranslateServiceEnum.BING_DICT)
)

/**
 * 注入服务名称
 *
 * @param list 列表
 * @param serviceEnum 服务类型
 */
function injectService(
  list,
  serviceEnum
): [{ languageName; languageType; serviceList: { name; type; logo } }] {
  return list.map((value) => {
    return {
      ...value,
      serviceList: [TranslateServiceEnum.getInfoByService(serviceEnum)]
    }
  })
}

/**
 * 合并多个翻译支持的语言
 *
 * @param listArray 翻译支持语言数组
 */
function mergeLanguageList(listArray) {
  // 以翻译名称为key的集合
  const merged = {}
  // 遍历所有翻译列表
  for (let i = 0; i < listArray.length; i++) {
    const list = listArray[i]
    for (let j = 0; j < list.length; j++) {
      const item = list[j]
      // 获取翻译语言类型
      const languageType = item.languageType
      // 获取翻译语言名称
      const languageName = item.languageName
      // 校验翻译语言是否已经存在集合中
      if (!merged[languageName]) {
        // 翻译语言还不在集合中则进行创建
        merged[languageName] = {
          languageName: item.languageName,
          serviceList: []
        }
      }
      // 翻译语言 已在集合中则遍历 翻译语言 中 已配置的 翻译源
      const serviceList = merged[languageName].serviceList
      for (let k = 0; k < item.serviceList.length; k++) {
        // 翻译源信息
        const service = item.serviceList[k]
        serviceList.push({
          name: service.name,
          type: service.type,
          logo: service.logo,
          languageType: languageType
        })
      }
    }
  }
  return Object.values(merged)
}

/**
 * 加载翻译支持的语言列表
 */
const initLanguageList = () => {
  const languageArray = []
  const translateServiceMapData = getTranslateServiceMapByUse()
  for (const translateService of translateServiceMapData.values()) {
    languageArray.push(languageMap.get(translateService['type']))
  }
  return mergeLanguageList(languageArray)
}

export { initLanguageList }
