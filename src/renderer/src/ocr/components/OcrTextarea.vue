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
          :autosize="{ minRows: 18, maxRows: 18 }"
        >
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import loadingImage from '../../assets/loading.gif'
// OCR内容
const ocrContent = ref('')

// 加载loading
const loadingImageSrc = ref(loadingImage)
// 是否触发屏幕截图
const isScreenshotEnd = ref(false)

const emit = defineEmits(['show-result-event', 'is-result-loading-event'])
</script>

<style lang="scss" scoped>
@import '../../css/translate.scss';
@import '../../css/translate-input.scss';

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
</style>
