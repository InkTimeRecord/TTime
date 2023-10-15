import { isNull } from '../../../common/utils/validate'
import ElMessageExtend from './messageExtend'
import { cacheGet } from './cacheUtil'
import { PlaySpeechServiceEnum } from '../../../common/enums/PlaySpeechServiceEnum'

/**
 * 文字写入到剪贴板
 */
const textWriteShearPlate = (text): void => {
  if (isNull(text)) {
    ElMessageExtend.warning('复制的文本内容为空')
    return
  }
  window.api.textWriteShearPlateEvent(text)
  ElMessageExtend.success('复制成功')
}

/**
 * 文字写入到剪贴板 - 驼峰格式
 */
const copyCamelCase = (text): void => {
  // 去除标点符号并替换为空格
  text = text.replace(/[^\w\s]|_/g, ' ').replace(/\s+/g, ' ')
  // 将单词转换为小写
  text = text.toLowerCase()
  // 转换为驼峰命名
  text = text.replace(/\s(.)/g, (_match, group) => {
    return group.toUpperCase()
  })
  // 去除空格
  text = text.replace(/\s/g, '')
  textWriteShearPlate(text)
}

/**
 * 文字写入到剪贴板 - 下划线格式
 */
const copySnakeCase = (text): void => {
  // 去除标点符号并替换为空格
  text = text.replace(/[^\w\s]|_/g, ' ').replace(/\s+/g, ' ')
  // 将空格替换为下划线并转换为小写
  text = text.replace(/\s/g, '_').toLowerCase()
  // 将连续的下划线替换为单个下划线
  text = text.replace(/_{2,}/g, '_')
  // 修剪结尾的下划线
  text = text.replace(/_$/, '')
  textWriteShearPlate(text)
}

/**
 * 播放语音
 *
 * @param text 播放的文字
 */
const playSpeech = (text): void => {
  const playSpeechService = cacheGet('playSpeechService')
  if (playSpeechService === PlaySpeechServiceEnum.TTIME) {
    const synth = window.speechSynthesis
    const msg = new SpeechSynthesisUtterance(text)
    // 先清除当前正在播放的语音再播放
    synth.cancel()
    synth.speak(msg)
  } else {
    playSpeechNewAudioByService(playSpeechService, text)
  }
}

/**
 * 播放语音
 *
 * @param playSpeechService 播放语音服务
 * @param text              播放的文字
 */
const playSpeechNewAudioByService = (playSpeechService, text): void => {
  let url
  if (playSpeechService === PlaySpeechServiceEnum.YOUDAO) {
    url = 'https://dict.youdao.com/dictvoice?audio=' + text + '&le=zh'
  } else if (playSpeechService === PlaySpeechServiceEnum.SOGOU) {
    url =
      'https://fanyi.sogou.com/reventondc/synthesis?text=' +
      text +
      '&speed=1&lang=zh-CHS&from=translateweb&speaker=6'
  }
  playSpeechNewAudio(url)
}

/**
 * 全局播放语音唯一对象
 *
 * 为了保持可以单例 不会出现点击多次播放语音重叠
 */
let playSpeechAudio

/**
 * 播放语音
 *
 * @param url 播放语音服务
 */
const playSpeechNewAudio = (url): void => {
  if (null != playSpeechAudio) {
    playSpeechAudio.pause()
    playSpeechAudio = null
  }
  // 此处是异步加载的语音文件
  playSpeechAudio = new Audio(url)
  // 文件加载错误事件
  playSpeechAudio.onerror = (): void => {
    ElMessageExtend.error('语音播放失败')
  }
  // 文件加载成功事件
  playSpeechAudio.onloadeddata = (): void => {
    playSpeechAudio.play()
  }
}

export default {
  textWriteShearPlate,
  copyCamelCase,
  copySnakeCase,
  playSpeech,
  playSpeechNewAudio
}
