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
import { isNotNull, isNull } from '../../../../common/utils/validate'
import LanguageEnum from '../../enums/LanguageEnum'

import loadingImage from '../../assets/loading.gif'
import translate from '../../utils/translate'
import {
  getTranslateServiceMapByUse,
  TranslateServiceBuilder
} from '../../utils/translateServiceUtil'
import { cacheGet, cacheGetByType, cacheSetByType } from '../../utils/cacheUtil'
import ElMessageExtend from '../../utils/messageExtend'
import {
  getLanguageNameConversion,
  getLanguageResultNameConversion
} from '../../utils/languageUtil'
import { YesNoEnum } from '../../../../common/enums/YesNoEnum'
import { findLanguageByLanguageName } from './channel/language/ChannelLanguage'
import TranslateRecordVo from '../../../../common/class/TranslateRecordVo'
import TranslateServiceRecordVo from '../../../../common/class/TranslateServiceRecordVo'
import { StoreTypeEnum } from '../../../../common/enums/StoreTypeEnum'
import { updateTranslateRecordList } from '../../utils/translateRecordUtil'

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
 * 文字写入到剪贴板
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
  if (cacheGet('wrapReplaceSpaceStatus') === YesNoEnum.Y) {
    translateContentDealWith = translateContentDealWith.replaceAll('\n', ' ').replaceAll('\r', ' ')
  }
  // 获取当前默认输入文字语言
  let inputLanguage = cacheGet('inputLanguage')
  // 获取当前默认输入文字语言类型
  const languageInputType = inputLanguage.languageType
  if (languageInputType === LanguageEnum.AUTO) {
    // 自动检测输入文字的语言
    const languageName = getLanguageNameConversion(translateContentDealWith)
    inputLanguage = findLanguageByLanguageName(languageName)
  }
  // 获取当前默认翻译结果文字语言
  let resultLanguage = cacheGet('resultLanguage')
  // 获取当前默认翻译结果文字语言类型
  const languageResultType = resultLanguage.languageType
  if (languageResultType === LanguageEnum.AUTO) {
    // 自动检测翻译结果文字语言
    // 根据输入的语言类型获取翻译结果的语言
    const languageName = getLanguageResultNameConversion(translateContentDealWith)
    resultLanguage = findLanguageByLanguageName(languageName)
  }
  // 设置显示翻译加载中状态
  emit('is-result-loading-event', true)
  // 应用翻译使用
  window.api.ttimeApiTranslateUse()
  // 获取当前正在使用的翻译源
  const translateServiceMapData = getTranslateServiceMapByUse()
  // 构建翻译记录信息
  const translateRecordVo = TranslateRecordVo.build({
    translateContentDealWith,
    inputLanguage,
    resultLanguage
  })
  const requestMap = new Map()
  // 遍历当前正在使用的翻译源
  for (const translateService of translateServiceMapData.values()) {
    // 翻译源类型
    const type = translateService.type
    // 如果不为自动识别 则从翻译源对应的文字语言中找到对应的语言代码
    const inputServiceLanguage = inputLanguage?.serviceList?.find((service) => {
      return service.type === translateService.type
    })
    if (isNull(inputServiceLanguage)) {
      // 此处校验是用于用户在使用多翻译源情况下 部分翻译源支持某种语言 而部分翻译源不支持
      window.api.apiTranslateResultMsgCallbackEvent(translateService.type, '不支持翻译当前语言')
      continue
    }
    // 输入文字语言类型
    const languageInputTypeRequest = inputServiceLanguage.languageType

    const resultServiceLanguage = resultLanguage?.serviceList?.find((service) => {
      return service.type === translateService.type
    })
    if (isNull(resultServiceLanguage)) {
      window.api.apiTranslateResultMsgCallbackEvent(translateService.type, '不支持翻译当前语言结果')
      continue
    }
    // 翻译结果语言类型
    const languageResultTypeRequest = resultServiceLanguage.languageType

    let info = buildTranslateRequestInfo(
      translateContentDealWith,
      languageInputTypeRequest,
      languageResultTypeRequest
    )
    info = {
      ...info,
      requestId: translateRecordVo.requestId,
      id: translateService.id,
      appId: translateService.appId,
      appKey: translateService.appKey
    }
    const defaultInfo = TranslateServiceBuilder.getServiceConfigInfo(type).defaultInfo
    if (isNotNull(defaultInfo)) {
      Object.keys(defaultInfo).forEach((key) => {
        info[key] = translateService[key]
      })
    }
    requestMap.set(type, info)
  }
  // 翻译记录状态
  const translateHistoryStatus = cacheGet('translateHistoryStatus') === YesNoEnum.Y
  if (translateHistoryStatus) {
    // 构建翻译记录信息
    const translateServiceRecordList = []
    requestMap.forEach((value, key) => {
      const serviceRecordVo = new TranslateServiceRecordVo()
      serviceRecordVo.translateServiceType = key
      serviceRecordVo.translateServiceId = value.id
      translateServiceRecordList.push(serviceRecordVo)
    })
    translateRecordVo.translateServiceRecordList = translateServiceRecordList
    let translateRecordList = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
    translateRecordList = isNull(translateRecordList) ? [] : translateRecordList
    translateRecordList.push(translateRecordVo)
    // 更新翻译记录
    updateTranslateRecordList(translateRecordList)
  }
  // 触发翻译
  requestMap.forEach((value, key) => {
    // 此处触发之后会异步回调到 *ApiTranslateCallbackEvent 方法中去执行
    window.api.apiUniteTranslate(key, value)
  })
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
