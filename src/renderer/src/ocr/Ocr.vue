<template>
  <div class="block">
    <Header />
    <div class="block-layer">
      <div class="content-layer content-left-block">
        <ocr-img @is-result-loading-event="(value) => ocrTextareaRef.setIsResultLoading(value)" />
      </div>
      <div class="content-layer content-right-block">
        <ocr-textarea ref="ocrTextareaRef" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
import OcrTextarea from './components/OcrTextarea.vue'
import OcrImg from './components/OcrImg.vue'
import { ref } from 'vue'
import ElMessageExtend from '../utils/messageExtend'

const ocrTextareaRef = ref('')

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
@import '../css/global.scss';
.block {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: var(--ttime-translate-color-background);
  box-shadow: 1px 1px 4px -1px var(--ttime-box-shadow-color);
  border: solid 1px var(--ttime-translate-border-color);

  .block-layer {
    width: 1280px;
    height: 690px;
    display: flex;
    .content-layer {
      flex: 1;
      width: 50%;
      border-radius: 7px;
      background-color: var(--ttime-translate-input-color-background);
      overflow: hidden;
      margin: 0 14px 14px 14px;
    }
    .content-left-block {
    }
    .content-right-block {
    }
  }
}
</style>
