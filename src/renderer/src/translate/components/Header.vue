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
        <a v-if="translateHistoryStatus" class="function-tools" @click="toSetTranslateHistoryPage">
          <svg-icon icon-class="translate-history" class="function-tools-icon" />
        </a>
        <a class="function-tools" @click="toSetPage">
          <svg-icon icon-class="set-up" class="function-tools-icon" />
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { YesNoEnum } from '../../../../common/enums/YesNoEnum'
import { nextTick, ref } from 'vue'
import { cacheDelete, cacheGet, cacheSet } from '../../utils/cacheUtil'

// 首次打开时设置默认图钉状态
if (undefined === cacheGet('thumbtackStatus')) {
  cacheSet('thumbtackStatus', YesNoEnum.N)
}

// 窗口固定状态
const thumbtackStatus = ref(cacheGet('thumbtackStatus'))
// 翻译历史记录状态
const translateHistoryStatus = ref(cacheGet('translateHistoryStatus') === YesNoEnum.Y)
// 窗口显示事件 当窗口显示时触发
window.api.winShowEvent(() => {
  nextTick(() => {
    translateHistoryStatus.value = cacheGet('translateHistoryStatus') === YesNoEnum.Y
  })
})
// 根据固定状态设置窗口是否置于最前面
window.api.alwaysOnTopEvent(thumbtackStatus.value === YesNoEnum.Y)

/**
 * 窗口固定
 */
const thumbtackFun = (): void => {
  const thumbtackStatusCache = cacheGet('thumbtackStatus')
  cacheSet(
    'thumbtackStatus',
    undefined === thumbtackStatusCache
      ? YesNoEnum.N
      : thumbtackStatusCache === YesNoEnum.N
      ? YesNoEnum.Y
      : YesNoEnum.N
  )
  thumbtackStatus.value = cacheGet('thumbtackStatus')
  window.api.alwaysOnTopEvent(cacheGet('thumbtackStatus') === YesNoEnum.Y)
}

/**
 * 跳转设置页面
 */
const toSetPage = (): void => {
  cacheDelete('setPageMenuIndex')
  window.api.openSetPageEvent()
}

/**
 * 跳转设置页面
 */
const toSetTranslateHistoryPage = (): void => {
  cacheSet('setPageMenuIndex', 'translateHistory')
  window.api.openSetPageEvent()
}
</script>

<style lang="scss" scoped>
@import '../../css/translate.scss';

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
