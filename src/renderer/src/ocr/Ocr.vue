<template>
  <div class="block">
    <Header />
    <div class="block-layer">
      <el-row>
        <el-col :span="12">
          <div class="content-layer content-left-block">
            <ocr-img
              @is-result-loading-event="(value) => ocrTextareaRef.setIsResultLoading(value)"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="content-layer content-right-block">
            <ocr-textarea ref="ocrTextareaRef" />
          </div>
        </el-col>
      </el-row>
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

window.api.winSizeUpdate((newBounds) => {
  const elements = document.querySelectorAll('.content-layer')
  elements.forEach((element) => {
    element['style'].maxHeight = newBounds.height - 60 + 'px'
    element['style'].height = newBounds.height - 60 + 'px'
    // 除2是因为有两个div : ocr图片div 和 ocr文本div
    const width = newBounds.width / 2
    element['style'].maxWidth = width - 10 + 'px'
  })
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
    min-width: 789px;
    min-height: 380px;
    .content-layer {
      height: 100%;
      border-radius: 7px;
      background-color: var(--ttime-translate-input-color-background);
      overflow: hidden;
      margin: 0 14px 14px 14px;
      max-width: 789px;
      max-height: 370px;
    }
    .content-left-block {
    }
    .content-right-block {
    }
  }
}
.el-row {
  min-width: 789px;
  min-height: 370px;
}
</style>
