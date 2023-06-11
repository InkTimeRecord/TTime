<template>
  <div class="content-block">
    <div class="content">
      <div class="content-textarea-block">
        <div v-show="isScreenshotEnd" class="content-textarea-placeholder">
          <span class="content-textarea-screenshot-text">文字识别中</span>
          <img class="content-textarea-screenshot-loading" :src="loadingImageSrc" />
        </div>
        <el-input
          v-show="!isScreenshotEnd"
          ref="ocrContentInputRef"
          v-model="ocrContent"
          class="content-textarea"
          spellcheck="false"
          type="textarea"
          :autosize="{ minRows: 29, maxRows: 29 }"
        />
        <div v-show="!isScreenshotEnd" class="function-tools-layer">
          <div class="function-tools-block">
            <el-tooltip placement="bottom-start">
              <template #content>复制文本</template>
              <a class="function-tools" @click="textWriteShearPlate()">
                <svg-icon icon-class="copy" class="function-tools-icon" />
              </a>
            </el-tooltip>
            <el-tooltip placement="bottom-start">
              <template #content>翻译</template>
              <a class="function-tools" @click="textWriteShearPlate()">
                <svg-icon icon-class="translate" class="function-tools-icon" />
              </a>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import loadingImage from '../../assets/loading.gif'
import { isNull } from '../../utils/validate'
import ElMessageExtend from '../../utils/messageExtend'
// OCR内容
const ocrContent = ref('')

// 加载loading
const loadingImageSrc = ref(loadingImage)
// 是否触发屏幕截图
const isScreenshotEnd = ref(false)

const textWriteShearPlate = (): void => {
  if (isNull(ocrContent.value)) {
    ElMessageExtend.warning('复制的文本内容为空')
    return
  }
  window.api.textWriteShearPlateEvent(ocrContent.value)
  ElMessageExtend.success('复制成功')
}

window.api.updateText((text) => {
  ocrContent.value = text
  isScreenshotEnd.value = false
})

/**
 * 设置显示加载中状态
 *
 * @param value 加载中状态
 */
const setIsResultLoading = (value): void => {
  ocrContent.value = ''
  isScreenshotEnd.value = value
}

defineExpose({
  setIsResultLoading
})
</script>

<style lang="scss" scoped>
@import '../../css/translate.scss';
@import '../../css/translate-textarea.scss';

.content-textarea-placeholder {
  display: flex;
  height: 52px;
  padding: 10px 10px 1px 10px;

  .content-textarea-screenshot-loading {
    height: 16px;
  }

  .content-textarea-screenshot-text {
    font-size: 12px;
    color: $input-loading-text-color;
    margin-right: 10px;
  }
}
.function-tools-layer {
  margin-top: 6px;
  height: 40px;
  //background-color: var(--ttime-translate-input-header-color-background);
  display: flex;
  align-items: center;
}
</style>
