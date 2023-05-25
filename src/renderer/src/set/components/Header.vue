<template>
  <div class='header'>
    <div class='function-tools-block'>
      <div class='function-tools-category'></div>
      <div class='function-tools-category'>
        <a class='function-tools cursor-pointer' v-if='!isMac()' @click='closeWin'>
          <svg-icon icon-class="close" class='function-tools-icon' />
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>/**
 * 关闭窗口
 */
import { SystemTypeEnum } from '../../enums/SystemTypeEnum'

const closeWin = (): void => {
  window.api.closeSetWinEvent()
}

const isMac = (): boolean => {
  return SystemTypeEnum.isMac()
}

</script>

<style lang='scss' scoped>
@import '../../css/global.scss';

.header {
  // 配置窗口可拖拽
  -webkit-app-region: drag;
  height: 39px;
  margin-top: 5px;

  .function-tools-block {
    padding: 8px 15px 8px 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
