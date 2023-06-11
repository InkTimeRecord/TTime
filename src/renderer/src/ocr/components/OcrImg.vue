<template>
  <div class="img-block">
    <img class="img" :src="imgData" />
  </div>
  <div class="function-tools-layer">
    <div class="function-tools-block">
      <el-tooltip placement="bottom-start">
        <template #content>复制图片</template>
        <a class="function-tools" @click="imgWriteShearPlate()">
          <svg-icon icon-class="copy" class="function-tools-icon" />
        </a>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import loadingImage from '../../assets/loading.gif'
import { isNull } from '../../utils/validate'
import ElMessageExtend from '../../utils/messageExtend'
const emit = defineEmits(['is-result-loading-event'])

// const imgUrl = ref('https://ttime.timerecord.cn/img/png/translate-fun.png')
// const imgUrl = ref('https://ttime.timerecord.cn/img/png/basiInfo.png')
// const imgUrl = ref('https://ttime.timerecord.cn/img/test/01.png')
// const imgUrl = ref('https://ttime.timerecord.cn/img/test/02.png')
// const imgUrl = ref('https://ttime.timerecord.cn/img/test/03.png')
const imgData = ref('')

/**
 * 图片写入到剪切板
 */
const imgWriteShearPlate = (): void => {
  if (isNull(imgData.value)) {
    ElMessageExtend.warning('复制的图片不存在')
    return
  }
  window.api.imgWriteShearPlateEvent(imgData.value)
  ElMessageExtend.success('复制成功')
}

window.api.updateImg((img) => {
  imgData.value = img
  emit('is-result-loading-event', true)
})
</script>

<style lang="scss" scoped>
@import '../../css/global.scss';

.img-block {
  border-radius: 7px;
  overflow: hidden;
  width: 100%;
  height: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .img {
    border-radius: 7px;
    max-width: 100%;
    max-height: 98%;
    width: auto;
    height: auto;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }
}
.function-tools-layer {
  position: fixed;
  bottom: 21px;
}
</style>
