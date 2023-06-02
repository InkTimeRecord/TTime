<template>
  <div class="content-block">
    <div class="content">
      <div class="content-input-block">
        <div v-show="isScreenshotEnd" class="content-input-placeholder">
          <span class="content-input-screenshot-text">文字识别中</span>
          <img class="content-input-screenshot-loading" :src="loadingImageSrc" />
        </div>
        <el-input
          v-show="!isScreenshotEnd"
          ref="translateContentInputRef"
          v-model="translateContent"
          class="content-input"
          spellcheck="false"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          placeholder="请输入单词或文字"
          @keydown="translateChange"
          @focus="translateContentFocus"
        >
        </el-input>
        <div class="function-tools-block">
          <a v-show="!isScreenshotEnd" class="function-tools" @click="playSpeech(translateContent)">
            <svg-icon icon-class="play" class="function-tools-icon" />
          </a>
          <a
            v-show="!isScreenshotEnd"
            class="function-tools"
            @click="textWriteShearPlate(translateContent)"
          >
            <svg-icon icon-class="copy" class="function-tools-icon" />
          </a>
          <a v-show="isScreenshotEnd" class="function-tools" @click="screenshotRestore">
            <svg-icon icon-class="restore" class="function-tools-icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { isNull } from '../../utils/validate'
import LanguageEnum from '../../enums/LanguageEnum'

import loadingImage from '../../assets/loading.gif'
import translate from '../../utils/translate'
import { getTranslateServiceMapByUse } from '../../utils/translateServiceUtil'
import { TranslateServiceEnum } from '../../enums/TranslateServiceEnum'
import { cacheGet, cacheGetStr } from '../../utils/cacheUtil'
import ElMessageExtend from '../../utils/messageExtend'
import {
  getLanguageTypeByOpenAI,
  getLanguageResultTypeByOpenAI,
  getLanguageResultType,
  getLanguageTypeByVolcano
} from '../../utils/languageUtil'
import { YesNoEnum } from '../../enums/YesNoEnum'

// 加载loading
const loadingImageSrc = ref(loadingImage)
// 是否触发屏幕截图
const isScreenshotEnd = ref(false)
// 翻译输入框内容
const translateContent = ref('')
// 翻译输入框ref
const translateContentInputRef = ref()
const emit = defineEmits(['show-result-event', 'is-result-loading-event'])

watch(translateContent, () => {
  // 页面高度改变监听
  window.api.windowHeightChangeMaxEvent()
  // 当翻译内容被改变时则直接关闭截图翻译状态
  // 屏幕截图识别中状态重置
  screenshotRestore()
})

// 截图翻译结束事件
window.api.screenshotEndNotifyEvent(() => {
  isScreenshotEnd.value = true
})

// 监听更新翻译输入内容事件
window.api.updateTranslateContentEvent((content) => {
  translateContent.value = content
  translateFun()
})

/**
 * 翻译内容获取焦点事件
 */
const translateContentFocus = (): void => {
  // 当获取焦点时触发 窗口高度更改最大事件
  window.api.windowHeightChangeMaxEvent()
}

// 窗口显示事件 当窗口显示时触发
window.api.winShowEvent(() => {
  nextTick(() => {
    translateContentInputRef.value.focus()
  })
})

/**
 * 屏幕截图识别中状态重置
 */
const screenshotRestore = (): void => {
  isScreenshotEnd.value = false
}

/**
 * 播放语音
 *
 * @param text 播放的文字
 */
const playSpeech = (text): void => {
  translate.playSpeech(text)
}

/**
 * 文字写入到剪切板
 */
const textWriteShearPlate = (text): void => {
  translate.textWriteShearPlate(text)
}

/**
 * 翻译触发
 */
const translateChange = async (event): Promise<void> => {
  // 按下 ctrl/command + 回车 = 换行
  if (event.keyCode === 13 && event.ctrlKey) {
    // 换行
    translateContent.value += '\n'
    return
  }

  // 文本粘贴快捷键
  const isCtrlV = event.ctrlKey && event.keyCode === 86

  // keyCode 13 = 回车
  if (event.keyCode !== 13 && !isCtrlV) {
    return
  }

  // 延时100毫秒
  if (isCtrlV) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  if (isContentNull(translateContent.value)) {
    ElMessageExtend.warning('内容不能为空')
    event.preventDefault()
    return
  }
  translateFun()
  // 阻止浏览器默认换行操作
  event.preventDefault()
}

/**
 * 翻译
 */
const translateFun = (): void => {
  emit('show-result-event', false)
  // 翻译内容
  let translateContentDealWith = translateContent.value
  window.api.logInfoEvent('[翻译事件] - 翻译内容 : ', translateContentDealWith)
  // 替换所有换行符、回车符后如果发送的消息还是为空则默认不继续进行操作
  if (isContentNull(translateContentDealWith)) {
    window.api.logInfoEvent('[翻译事件] - 翻译内容过滤后为空')
    translateContent.value = ''
    // 屏幕截图识别中状态重置
    screenshotRestore()
    ElMessageExtend.warning('识别内容为空')
    return
  }
  // 换行符替换为空格状态
  if (cacheGetStr('wrapReplaceSpaceStatus') === YesNoEnum.Y) {
    translateContentDealWith = translateContentDealWith.replaceAll('\n', ' ')
  }
  // 获取当前默认输入文字语言
  const inputLanguage = cacheGet('inputLanguage')
  // 是否自动检测输入文字语言
  let isInputAuto = false
  // 获取当前默认输入文字语言类型
  const languageInputType = inputLanguage.languageType
  if (languageInputType === LanguageEnum.AUTO) {
    // 自动检测输入文字的语言
    isInputAuto = true
  }
  // 获取当前默认翻译结果文字语言
  const resultLanguage = cacheGet('resultLanguage')
  // 是否自动检测翻译结果文字语言
  let isResultAuto = false
  // 获取当前默认翻译结果文字语言类型
  let languageResultType = resultLanguage.languageType
  if (languageResultType === LanguageEnum.AUTO) {
    // 自动检测翻译结果文字语言
    isResultAuto = true
    // 根据输入的语言类型获取翻译结果的语言
    languageResultType = getLanguageResultType(translateContentDealWith)
  }
  // 设置显示翻译加载中状态
  emit('is-result-loading-event', true)
  // 应用翻译使用
  window.api.ttimeApiTranslateUse()
  // 获取当前正在使用的翻译源
  const translateServiceMapData = getTranslateServiceMapByUse()
  // 遍历当前正在使用的翻译源
  for (const translateService of translateServiceMapData.values()) {
    // 翻译源类型
    const type = translateService.type
    // 输入文字语言类型
    let languageInputTypeRequest = languageInputType
    // 翻译结果语言类型
    let languageResultTypeRequest = languageResultType
    if (!isInputAuto) {
      // 如果不为自动识别 则从翻译源对应的文字语言中找到对应的语言代码
      const language = inputLanguage.serviceList.find((service) => {
        return service.type === translateService.type
      })
      if (isNull(language)) {
        // 此处校验是用于用户在使用多翻译源情况下 部分翻译源支持某种语言 而部分翻译源不支持
        window.api.apiTranslateResultMsgCallbackEvent(translateService.type, '不支持翻译当前语言')
        continue
      }
      // 输入文字语言类型
      languageInputTypeRequest = language.languageType
    } else {
      // 当 输入文字语言类型 为 自动识别 时 由于部分翻译源不支持 自动识别 所以此处做特殊处理 内部自己识别一下
      // 之后可以考虑都使用本地识别 不使用翻译源对应的自动识别类型
      if (TranslateServiceEnum.OPEN_AI === type) {
        languageInputTypeRequest = getLanguageTypeByOpenAI(translateContentDealWith)
      }
      if (TranslateServiceEnum.VOLCANO === type) {
        languageInputTypeRequest = getLanguageTypeByVolcano(translateContentDealWith)
      }
    }
    if (!isResultAuto) {
      const language = resultLanguage.serviceList.find((service) => {
        return service.type === translateService.type
      })
      if (isNull(language)) {
        window.api.apiTranslateResultMsgCallbackEvent(
          translateService.type,
          '不支持翻译当前语言结果'
        )
        continue
      }
      languageResultTypeRequest = language.languageType
    } else {
      if (TranslateServiceEnum.OPEN_AI === type) {
        languageResultTypeRequest = getLanguageResultTypeByOpenAI(translateContentDealWith)
      }
    }
    let info = buildTranslateRequestInfo(
      translateContentDealWith,
      languageInputTypeRequest,
      languageResultTypeRequest
    )
    if (TranslateServiceEnum.TTIME !== type) {
      info = {
        ...info,
        appId: translateService.appId,
        appKey: translateService.appKey,
        // 此参数 OpenAI 使用
        model: translateService.model
      }
    }
    // 此处触发之后会异步回调到 *ApiTranslateCallbackEvent 方法中去执行
    window.api.apiUniteTranslate(type, info)
  }
}

const isContentNull = (content) => {
  return isNull(content.replaceAll('\n', '').replaceAll('\r', '').replaceAll(' ', ''))
}

const buildTranslateRequestInfo = (translateContentDealWith, languageType, languageResultType) => {
  return {
    channel: 0,
    translateContent: translateContentDealWith,
    languageType: languageType,
    languageResultType: languageResultType
  }
}

/**
 * 获取翻译内容
 */
const getTranslateContent = (): string => {
  return translateContent.value
}

/**
 * 设置翻译内容
 *
 * @param value 翻译内容
 */
const setTranslateContent = (value): void => {
  translateContent.value = value
}

/**
 * 清除翻译内容事件
 */
const clearTranslatedContentEvent = (): void => {
  setTranslateContent('')
}

defineExpose({
  getTranslateContent,
  setTranslateContent,
  clearTranslatedContentEvent
})
</script>

<style lang="scss" scoped>
@import '../../css/translate.scss';
@import '../../css/translate-input.scss';

.content-input-placeholder {
  display: flex;
  height: 52px;
  padding: 10px 10px 1px 10px;

  .content-input-screenshot-loading {
    height: 16px;
  }

  .content-input-screenshot-text {
    font-size: 12px;
    color: $input-loading-text-color;
    margin-right: 10px;
  }
}
</style>
