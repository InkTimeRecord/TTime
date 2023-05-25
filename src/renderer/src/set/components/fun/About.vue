<template>
  <div class='about-layer'>

    <div class='about-layer-up'>
      <img class='about-logo none-select' :src='logo' />
      <span class='app-name none-select'>
        TTime
        <span class='app-version none-select'>{{ version }}</span>
      </span>
      <span class='app-introduce none-select'>🚀 一款简洁、高效、高颜值的输入、截图、划词翻译软件</span>
    </div>

    <div class='about-layer-down'>
      <el-divider />
      <template v-for='(info, key) in list' :key='key'>
            <span class='about-info-url cursor-pointer' @click='toPage(info.url)'>{{ info.val }}</span>
        </template>
    </div>
  </div>
</template>
<script setup lang='ts'>
import logo from '../../../assets/logo.png'

import { ref } from 'vue'

const version = ref(window.api.getVersionEvent())

const list = ref([
  { url: 'https://ttime.timerecord.cn', val: '官网网站 ：https://ttime.timerecord.cn' },
  { url: 'https://github.com/InkTimeRecord/TTime', val: 'GitHub : https://github.com/InkTimeRecord/TTime' },
])

/**
 * 跳转页面
 */
const toPage = (url): void => {
  window.api.jumpToPage(url)
}

</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

.about-layer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;

  .about-layer-up {
    display: flex;
    flex-direction: column;
    align-items: center;

    .about-logo {
      -webkit-user-drag: none;
      height: 100px;
      width: 100px;
    }

    .app-name {
      color: var(--el-text-color-regular);
      margin-top: 15px;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 1px;
    }

    .app-introduce {
      color: var(--el-text-color-placeholder);
      font-size: 15px;
      font-weight: 400;
    }

    .app-version {
      color: var(--el-text-color-placeholder);
      font-size: 15px;
      font-weight: 400;
    }
  }

  .about-layer-down {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 130px;

    .about-info-name {
      margin-bottom: 0;
    }

    .about-info-url {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      padding: 3px;
    }

  }

}

</style>
