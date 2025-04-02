export default {
    name: 'MTranServer翻译',
    // 是否需要秘钥
    isKey: true,
    // 是否单秘钥
    isOneAppKey: true,
    // 构建时默认信息
    defaultInfo: {
      requestUrl: 'http://localhost:8989'
    },
    // 翻译语言
    languageList: [
      {
        languageName: '中文(简体)',
        languageType: 'zh'
      },
      {
        languageName: '中文(繁体)',
        languageType: 'zh'
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
        languageName: '德语',
        languageType: 'de'
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
        languageName: '俄语',
        languageType: 'ru'
      },
      {
        languageName: '葡萄牙语',
        languageType: 'pt'
      },
      {
        languageName: '阿拉伯语',
        languageType: 'ar'
      },
      {
        languageName: '波兰语',
        languageType: 'pl'
      },
      {
        languageName: '波斯语',
        languageType: 'fa'
      }
    ]
  }
  