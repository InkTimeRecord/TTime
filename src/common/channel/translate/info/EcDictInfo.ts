export default {
  name: '简明英汉词典(内置)',
  // 是否需要秘钥
  isKey: false,
  // 是否单秘钥
  isOneAppKey: false,
  // 构建时默认信息
  defaultInfo: {
    filePath: null
  },
  // 翻译语言
  languageList: [
    {
      languageName: '中文(简体)',
      languageType: 'zh'
    },
    {
      languageName: '英语',
      languageType: 'en'
    }
  ]
}
