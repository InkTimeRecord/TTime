<template>
  <div class="block">
    <Header />
    <div class="block-layer">
      <div class="layer-center">
        <div class="center-block">
          <!--          <img class="center-left" src="https://ttime.timerecord.cn/img/png/translate-fun.png" />-->
          <!--          <img class="center-left" src="https://ttime.timerecord.cn/img/png/basiInfo.png" />-->
          <!--          <img class="center-left" src="https://ttime.timerecord.cn/img/test/01.png" />-->
          <img class="center-left" src="https://ttime.timerecord.cn/img/test/02.png" />
        </div>
      </div>
      <div class="layer-center">
        <div class="center-block">
          <div class="center-right">
            <ocr-textarea />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'

import { ref } from 'vue'
import OcrTextarea from './components/OcrTextarea.vue'

const ocrText = ref('')
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
    height: 450px;
    display: flex;
    justify-content: space-between;

    .layer-center {
      display: flex;
      margin: 0 12px 12px 12px;
      width: 100%;
      align-items: center;

      .center-block {
        width: 100%;
        border-radius: 7px;
        background-color: var(--ttime-translate-input-color-background);
        padding: 20px;
        text-align: center;

        .center-left {
          -webkit-user-drag: none;
          user-select: none;
          width: 100%;
          height: 100%;
          border-radius: 7px;
        }

        .center-right {
          height: 100%;
          border-radius: 7px;
        }
      }
    }
  }
}

.block-layer::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.block-layer::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

.block-layer::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
