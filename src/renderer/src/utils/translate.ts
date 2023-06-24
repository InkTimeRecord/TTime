import { isNull } from '../../../common/utils/validate'
import ElMessageExtend from './messageExtend'
import { cacheGetStr } from './cacheUtil'
import { PlaySpeechServiceEnum } from '../enums/PlaySpeechServiceEnum'

/**
 * 文字写入到剪切板
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
 * 播放语音
 *
 * @param text 播放的文字
 */
const playSpeech = (text): void => {
  const playSpeechService = cacheGetStr('playSpeechService')
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
  playSpeechAudio.onerror = function () {
    ElMessageExtend.error('语音播放失败')
  }
  // 文件加载成功事件
  playSpeechAudio.onloadeddata = function () {
    playSpeechAudio.play()
  }
}

export default {
  textWriteShearPlate,
  playSpeech,
  playSpeechNewAudio
}
