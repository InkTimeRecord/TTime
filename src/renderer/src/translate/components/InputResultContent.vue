<template>
  <div v-for="translateService in translateServiceMap.values()">
    <input-result-content-channel
      :key="translateService.id"
      :ref="setChannelRef"
      :translate-service="translateService"
    />
  </div>
</template>

<script setup lang="ts">
import InputResultContentChannel from './channel/InputResultContentChannel.vue'

import { ref } from 'vue'
import { getTranslateServiceMapByUse } from '../../utils/translateServiceUtil'

// 翻译结果框
const channelRefs = ref([])
// 获取缓存中的翻译服务list
const translateServiceMap = ref()

/**
 * 加载翻译服务
 */
const initTranslateServiceMap = (): void => {
  // 翻译结果框
  channelRefs.value = []
  // 获取缓存中的翻译服务list
  translateServiceMap.value = getTranslateServiceMapByUse()
}
// 加载翻译服务
initTranslateServiceMap()

/**
 * 更新翻译服务事件
 */
window.api.updateTranslateServiceEvent(() => {
  // 加载翻译服务
  initTranslateServiceMap()
})

/**
 * 设置通道ref
 *
 * @param ref ref
 */
const setChannelRef = (ref): void => {
  if (ref) {
    channelRefs.value.push(ref)
  }
}

/**
 * 设置翻译内容
 *
 * @param value 翻译内容
 */
const setTranslatedResultContent = (value): void => {
  channelRefs.value.forEach((channel) => {
    channel.setTranslatedResultContent(value)
  })
}

/**
 * 设置显示翻译结果状态
 *
 * @param value 显示翻译结果
 */
const setShowResult = (value): void => {
  channelRefs.value.forEach((channel) => {
    channel.setShowResult(value)
  })
}

/**
 * 设置显示翻译加载中状态
 *
 * @param value 加载中状态
 */
const setIsResultLoading = (value): void => {
  channelRefs.value.forEach((channel) => {
    channel.setIsResultLoading(value)
  })
}

/**
 * 清空翻译结果内容事件
 */
const clearTranslatedResultContentEvent = (): void => {
  channelRefs.value.forEach((channel) => {
    channel.clearTranslatedResultContentEvent()
  })
}

defineExpose({
  setTranslatedResultContent,
  clearTranslatedResultContentEvent,
  setShowResult,
  setIsResultLoading
})
</script>

<style lang="scss" scoped></style>
