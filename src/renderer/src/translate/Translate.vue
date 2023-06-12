<template>
  <div class="block">
    <Header />
    <div class="block-layer">
      <Input
        ref="translateInput"
        @show-result-event="(value) => translatedResultInput.setShowResult(value)"
        @is-result-loading-event="(value) => translatedResultInput.setIsResultLoading(value)"
      />

      <language-select />

      <input-result-content ref="translatedResultInput" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Input from './components/Input.vue'
import LanguageSelect from './components/LanguageSelect.vue'
import InputResultContent from './components/InputResultContent.vue'

import { nextTick, ref } from 'vue'
import ElMessageExtend from '../utils/messageExtend'

import { ShortcutKeyEnum } from '../enums/ShortcutKeyEnum'
import { YesNoEnum } from '../enums/YesNoEnum'
import { isNull } from '../utils/validate'
import { buildTranslateService, setTranslateServiceMap } from '../utils/translateServiceUtil'
import { buildOcrService, setOcrServiceMap } from '../utils/ocrServiceUtil'
import { initTheme } from '../utils/themeUtil'
import { cacheGetStr, cacheSet, cacheSetStr } from '../utils/cacheUtil'
import { PlaySpeechServiceEnum } from '../enums/PlaySpeechServiceEnum'
import '../channel/ChannelRequest'
import { TranslateServiceEnum } from '../enums/TranslateServiceEnum'
import { OcrServiceEnum } from '../enums/OcrServiceEnum'

initTheme()

// 翻译输入组件
const translateInput = ref('')
const translatedResultInput = ref('')

// 应用启动
window.api.ttimeApiAppStart()

// 页面高度改变监听
window.api.pageHeightChangeEvent()

// 清空翻译输入、结果内容事件
window.api.clearAllTranslateContentEvent(() => {
  translatedResultInput.value.clearTranslatedResultContentEvent()
  translateInput.value.clearTranslatedContentEvent()
})

// 输入翻译触发的窗口显示事件
window.api.winShowByInputEvent(() => {
  nextTick(() => {
    // 当输入翻译触发显示窗口时 并且用户没有进行任何操作时
    // 会导致窗口大小一直是最大的 所以这里获取页面高度更新窗口大小
    window.api.windowHeightChangeEvent()
  })
})

/**
 * 翻译服务list 如果不存在则说明第一次打开
 * 初始化默认翻译服务
 */
if (isNull(cacheGetStr('translateServiceMap'))) {
  const map = new Map()
  const ttimeService = buildTranslateService(TranslateServiceEnum.TTIME)
  map.set(ttimeService.id, ttimeService)
  setTranslateServiceMap(map)

  const bingDictService = buildTranslateService(TranslateServiceEnum.BING_DICT)
  map.set(bingDictService.id, bingDictService)
  setTranslateServiceMap(map)

  const deepLBuiltInService = buildTranslateService(TranslateServiceEnum.DEEP_L_BUILT_IN)
  map.set(deepLBuiltInService.id, deepLBuiltInService)
  setTranslateServiceMap(map)

  const niuTransBuiltInService = buildTranslateService(TranslateServiceEnum.NIU_TRANS_BUILT_IN)
  map.set(niuTransBuiltInService.id, niuTransBuiltInService)
  setTranslateServiceMap(map)
}

/**
 * Ocr服务list 如果不存在则说明第一次打开
 * 初始化默认Ocr服务
 */
if (isNull(cacheGetStr('ocrServiceMap'))) {
  const map = new Map()
  const ttimeService = buildOcrService(OcrServiceEnum.TTIME)
  map.set(ttimeService.id, ttimeService)
  setOcrServiceMap(map)
}

// 首次打开时设置默认快捷键
if (undefined === cacheGetStr('inputShortcutKey')) {
  cacheSetStr('inputShortcutKey', 'Alt + Q')
}
if (undefined === cacheGetStr('screenshotShortcutKey')) {
  cacheSetStr('screenshotShortcutKey', 'Alt + W')
}
if (undefined === cacheGetStr('choiceShortcutKey')) {
  cacheSetStr('choiceShortcutKey', 'Alt + E')
}
if (undefined === cacheGetStr('screenshotOcrShortcutKey')) {
  cacheSetStr('screenshotOcrShortcutKey', 'Alt + Shift + S')
}
if (undefined === cacheGetStr('screenshotSilenceOcrShortcutKey')) {
  cacheSetStr('screenshotSilenceOcrShortcutKey', 'Alt + Shift + D')
}
// 首次加载 - 代理配置初始化
if (isNull(cacheGetStr('agentConfig'))) {
  cacheSet('agentConfig', {
    type: 0,
    checkStatus: false,
    host: '',
    port: '',
    userName: '',
    passWord: ''
  })
}

const translateShortcutKeyList = [
  { type: ShortcutKeyEnum.INPUT, shortcutKey: cacheGetStr('inputShortcutKey') },
  { type: ShortcutKeyEnum.SCREENSHOT, shortcutKey: cacheGetStr('screenshotShortcutKey') },
  { type: ShortcutKeyEnum.CHOICE, shortcutKey: cacheGetStr('choiceShortcutKey') },
  { type: ShortcutKeyEnum.SCREENSHOT_OCR, shortcutKey: cacheGetStr('screenshotOcrShortcutKey') },
  {
    type: ShortcutKeyEnum.SCREENSHOT_SILENCE_OCR,
    shortcutKey: cacheGetStr('screenshotSilenceOcrShortcutKey')
  }
]
window.api.logInfoEvent(
  '[初始加载翻译快捷键事件] - 开始，翻译快捷键列表 : ',
  translateShortcutKeyList
)
// 初始加载翻译快捷键事件
window.api.initLoadTranslateShortcutKeyEvent(translateShortcutKeyList)
window.api.logInfoEvent('[初始加载翻译快捷键事件] - 结束')
// 初始化开机自启事件
window.api.autoLaunchInitEvent()
// 初始化自动更新事件
if (undefined === cacheGetStr('autoUpdater')) {
  cacheSetStr('autoUpdater', YesNoEnum.Y)
}
if (cacheGetStr('autoUpdater') === YesNoEnum.Y) {
  // 静默更新事件
  window.api.autoUpdaterSilenceStartCheckEvent()
}
// 语音播放源
if (undefined === cacheGetStr('playSpeechService')) {
  cacheSetStr('playSpeechService', PlaySpeechServiceEnum.TTIME)
}
// 初始化置顶时允许隐藏窗口状态
if (undefined === cacheGetStr('alwaysOnTopAllowEscStatus')) {
  cacheSetStr('alwaysOnTopAllowEscStatus', YesNoEnum.N)
}
// 初始化换行符替换为空格状态
if (undefined === cacheGetStr('wrapReplaceSpaceStatus')) {
  cacheSetStr('wrapReplaceSpaceStatus', YesNoEnum.N)
}
// 初始化鼠标悬浮球取词状态
if (undefined === cacheGetStr('hoverBallStatus')) {
  cacheSetStr('hoverBallStatus', YesNoEnum.N)
}
// 初始化OCR结果写入剪切板状态
if (undefined === cacheGetStr('ocrWriteClipboardStatus')) {
  cacheSetStr('ocrWriteClipboardStatus', YesNoEnum.N)
}
// 初始化OCR结果换行符替换为空格状态
if (undefined === cacheGetStr('ocrWrapReplaceSpaceStatus')) {
  cacheSetStr('ocrWrapReplaceSpaceStatus', YesNoEnum.N)
}
window.api.updateCacheEvent((key, value) => {
  cacheSetStr(key, value)
})

/**
 * 调起消息弹层提示事件
 */
window.api.showMsgEvent((type, msg) => {
  if (type === ElMessageExtend.SUCCESS) {
    ElMessageExtend.success(msg)
  } else if (type === ElMessageExtend.WARNING) {
    ElMessageExtend.warning(msg)
  } else if (type === ElMessageExtend.ERROR) {
    ElMessageExtend.errorInOptions(msg, { duration: 5 * 1000 })
  }
})
</script>

<style lang="scss" scoped>
@import '../css/translate.scss';
@import '../css/translate-input.scss';

.block {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: var(--ttime-translate-color-background);
  box-shadow: 1px 1px 4px -1px var(--ttime-box-shadow-color);
  border: solid 1px var(--ttime-translate-border-color);
}

.block-layer {
  overflow: auto;
  max-height: 671px;
  overflow-x: hidden;
}

.block-layer::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.block-layer::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

.block-layer::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
