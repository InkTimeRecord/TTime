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

import { isNull } from '../../../common/utils/validate'
import { buildTranslateService, setTranslateServiceMap } from '../utils/translateServiceUtil'
import { buildOcrService, setOcrServiceMap } from '../utils/ocrServiceUtil'
import { initTheme } from '../utils/themeUtil'
import { cacheGet, oldCacheGet } from '../utils/cacheUtil'
import '../channel/ChannelRequest'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import OcrServiceEnum from '../../../common/enums/OcrServiceEnum'
import { loadNewServiceInfo } from '../utils/memberUtil'

initTheme()

// 翻译输入组件
const translateInput = ref('')
const translatedResultInput = ref('')

// 应用启动
window.api.ttimeApiAppStart()

// 页面高度改变监听
window.api.pageHeightChangeEvent()

loadNewServiceInfo()

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
if (isNull(cacheGet('translateServiceMap'))) {
  const translateServiceMap = oldCacheGet('translateServiceMap')
  if (undefined !== translateServiceMap) {
    // 兼容浏览器存储方式的数据 导入到文件存储里去
    setTranslateServiceMap(new Map(translateServiceMap))
  } else {
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
}

/**
 * Ocr服务list 如果不存在则说明第一次打开
 * 初始化默认Ocr服务
 */
if (isNull(cacheGet('ocrServiceMap'))) {
  const ocrServiceMap = oldCacheGet('ocrServiceMap')
  if (undefined !== ocrServiceMap) {
    // 兼容浏览器存储方式的数据 导入到文件存储里去
    setOcrServiceMap(new Map(ocrServiceMap))
  } else {
    const map = new Map()
    const ttimeService = buildOcrService(OcrServiceEnum.TTIME)
    map.set(ttimeService.id, ttimeService)
    setOcrServiceMap(map)
  }
}

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
