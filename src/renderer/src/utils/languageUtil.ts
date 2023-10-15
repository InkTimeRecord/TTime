import { franc } from 'franc'
import LanguageEnum from '../enums/LanguageEnum'

// 识别的语种列表
const only = [
  // 英文
  'eng',
  // 中文
  'cmn',
  // 韩语
  'kor',
  // 俄语
  'rus',
  // 日语
  'jpn'
]

export const getLanguageNameConversion = (translateContent): string => {
  let language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
  if (countChineseCharacters(translateContent) > 2) {
    language = language === LanguageEnum.JAPANESE ? language : LanguageEnum.CHINESE
  }
  if (LanguageEnum.NO === language) {
    language = LanguageEnum.ENGLISH
  }
  // 转换为翻译结果的语种类型
  const languageInputType = LanguageEnum.languageConversionMap.get(language).languageType
  window.api.logInfoEvent(
    '[翻译事件] - 输入内容语种识别结果 : ',
    language,
    ' , 输入文本语种 : ',
    languageInputType
  )
  return languageInputType
}

export const getLanguageResultNameConversion = (translateContent): string => {
  let language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
  if (countChineseCharacters(translateContent) > 2) {
    language = language === LanguageEnum.JAPANESE ? language : LanguageEnum.CHINESE
  }
  let languageResultType = LanguageEnum.CHINESE
  if (language !== LanguageEnum.NO) {
    if (language === LanguageEnum.CHINESE) {
      // 如果当前输入的为中文则翻译结果为英文
      languageResultType = LanguageEnum.ENGLISH
    } else if (language === LanguageEnum.ENGLISH) {
      // 如果当前输入的为英文则翻译结果为中文
      languageResultType = LanguageEnum.CHINESE
    } else {
      // 其他语言默认使用中文作为翻译结果
      languageResultType = LanguageEnum.CHINESE
    }
  }
  // 转换为翻译结果的语种类型
  languageResultType = LanguageEnum.languageConversionMap.get(languageResultType).languageType
  window.api.logInfoEvent(
    '[翻译事件] - 翻译内容语种识别结果 : ',
    language,
    ' , 翻译结果语种 : ',
    languageResultType
  )
  return languageResultType
}

/**
 * 统计中文数
 *
 * @param str 字符
 * @return 中文数
 */
const countChineseCharacters = (str): number => {
  // 匹配中文字符的正则表达式
  const pattern = /[\u4e00-\u9fa5]/g
  // 使用match方法获取所有匹配项
  const matches = str.match(pattern)
  // 返回匹配项的数量
  return matches ? matches.length : 0
}

/**
 * 是否为英文
 */
export const isEnglish = (str): boolean => {
  return /[a-zA-Z]/.test(str)
}
