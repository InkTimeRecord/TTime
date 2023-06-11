<template>
  <div class="header">
    <div class="function-tools-block">
      <div class="function-tools-category">
        <a class="function-tools" @click="thumbtackFun">
          <svg-icon
            :icon-class="thumbtackStatus === YesNoEnum.Y ? 'thumbtack-select' : 'thumbtack'"
            class="function-tools-icon"
          />
        </a>
      </div>
      <div class="function-tools-category">
        <a class="function-tools" @click="toSetPage">
          <svg-icon icon-class="set-up" class="function-tools-icon" />
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { YesNoEnum } from '../../enums/YesNoEnum'
import { ref } from 'vue'
import { cacheGetStr, cacheSetStr } from '../../utils/cacheUtil'

// 首次打开时设置默认图钉状态
if (undefined === cacheGetStr('ocrThumbtackStatus')) {
  cacheSetStr('ocrThumbtackStatus', YesNoEnum.N)
}

// 窗口固定状态
const thumbtackStatus = ref(cacheGetStr('ocrThumbtackStatus'))

// 根据固定状态设置窗口是否置于最前面
window.api.ocrAlwaysOnTopEvent(thumbtackStatus.value === YesNoEnum.Y)

/**
 * 窗口固定
 */
const thumbtackFun = (): void => {
  const thumbtackStatusCache = cacheGetStr('ocrThumbtackStatus')
  cacheSetStr(
    'ocrThumbtackStatus',
    undefined === thumbtackStatusCache
      ? YesNoEnum.N
      : thumbtackStatusCache === YesNoEnum.N
      ? YesNoEnum.Y
      : YesNoEnum.N
  )
  thumbtackStatus.value = cacheGetStr('ocrThumbtackStatus')
  window.api.ocrAlwaysOnTopEvent(cacheGetStr('ocrThumbtackStatus') === YesNoEnum.Y)
}

/**
 * 跳转设置页面
 */
const toSetPage = (): void => {
  // window.api.openSetPageEvent()
}
</script>

<style lang="scss" scoped>
@import '../../css/global.scss';

.header {
  // 配置窗口可拖拽
  -webkit-app-region: drag;
  height: 39px;
  margin-top: 5px;

  .function-tools-block {
    padding: 8px 15px 8px 10px;
    line-height: 1em;
    display: flex;
    justify-content: space-between;
  }
}
</style>
