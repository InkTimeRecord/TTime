<template>
  <div>
    <div class='header'>
      <el-radio-group v-model='menuIndex' size='small'>
        <el-radio-button :label='0'>文本翻译</el-radio-button>
        <el-radio-button :label='1'>文字识别</el-radio-button>
      </el-radio-group>
        <el-tooltip
          effect="dark"
          content='点击查看翻译源申请教程'
          placement="bottom-start"
        >
          <el-icon class='set-page-icon cursor-pointer to-page-translate-service-apply' @click='toPageTranslateServiceApply'><QuestionFilled /></el-icon>
        </el-tooltip>
    </div>

    <translate-service v-show='menuIndex === 0' />
    <ocr-service v-show='menuIndex === 1' />

  </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'

import TranslateService from './serviceConfig/TranslateService.vue'
import OcrService from './serviceConfig/OcrService.vue'

const menuIndex = ref(0)

const toPageTranslateServiceApply = (): void => {
  window.api.jumpToPage('https://ttime.timerecord.cn/pages/482152/')
}

</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
