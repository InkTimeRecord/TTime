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

export const getLanguageTypeByOpenAI = (translateContent) => {
  let language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
  if (LanguageEnum.NO === language) {
    language = LanguageEnum.ENGLISH
  }
  return LanguageEnum.languageOpenAIMap.get(language).languageType
}

export const getLanguageTypeByVolcano = (translateContent) => {
  let language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
  if (LanguageEnum.NO === language) {
    language = LanguageEnum.ENGLISH
  }
  return LanguageEnum.languageVolcanoMap.get(language).languageType
}

export const getLanguageTypeByPapago = (translateContent) => {
  let language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
  if (LanguageEnum.NO === language) {
    language = LanguageEnum.ENGLISH
  }
  return LanguageEnum.languagePapagoMap.get(language).languageType
}

export const getLanguageResultTypeByOpenAI = (translateContent) => {
  return getLanguageResultTypeByMap(LanguageEnum.languageOpenAIMap, translateContent)
}

export const getLanguageResultType = (translateContent) => {
  return getLanguageResultTypeByMap(LanguageEnum.languageMap, translateContent)
}

export const getLanguageResultTypeByMap = (languageMap, translateContent) => {
  const language = franc(translateContent, {
    // 检测最短字符
    minLength: 1,
    // 识别的语种范围
    only: only
  })
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
  languageResultType = languageMap.get(languageResultType).languageType
  window.api.logInfoEvent(
    '[翻译事件] - 翻译内容语种识别结果 : ',
    language,
    ' , 翻译结果语种 : ',
    languageResultType
  )
  return languageResultType
}
