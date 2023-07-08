<template>
  <div class="block">
    <Header />

    <el-container style="height: 554px">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu
            :default-openeds="['basiInfo', 'shortcutKey']"
            default-active="basiInfo"
            @select="menuSelect"
          >
            <el-menu-item index="basiInfo">
              <span class="none-select">偏好设置</span>
            </el-menu-item>
            <el-menu-item index="advancedInfo">
              <span class="none-select">高级设置</span>
            </el-menu-item>
            <el-menu-item index="shortcutKey">
              <span class="none-select">全局快捷键设置</span>
            </el-menu-item>
            <el-menu-item index="translateServiceConfig">
              <span class="none-select">翻译源设置</span>
            </el-menu-item>
            <el-menu-item index="translateHistory">
              <span class="none-select">翻译记录</span>
            </el-menu-item>
            <el-menu-item index="networkSet">
              <span class="none-select">网络设置</span>
            </el-menu-item>
            <el-menu-item index="about">
              <span class="none-select">关于</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-main class="main">
          <el-scrollbar>
            <basi-info v-show="menuIndex === 'basiInfo'" />
            <advanced-info v-show="menuIndex === 'advancedInfo'" />
            <shortcut-key v-show="menuIndex === 'shortcutKey'" />
            <translate-service-config v-show="menuIndex === 'translateServiceConfig'" />
            <translate-history v-show="menuIndex === 'translateHistory'" />
            <network-set v-show="menuIndex === 'networkSet'" />
            <about v-show="menuIndex === 'about'" />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
import BasiInfo from './components/fun/BasiInfo.vue'
import AdvancedInfo from './components/fun/AdvancedInfo.vue'
import ShortcutKey from './components/fun/ShortcutKey.vue'
import TranslateServiceConfig from './components/fun/TranslateServiceConfig.vue'
import TranslateHistory from './components/fun/TranslateHistory.vue'
import NetworkSet from './components/fun/NetworkSet.vue'
import About from './components/fun/About.vue'

import { ref } from 'vue'

/**
 * 当前选择的菜单索引
 */
const menuIndex = ref('basiInfo')

/**
 * 菜单选择事件
 *
 * @param index 菜单key
 */
const menuSelect = (index): void => {
  menuIndex.value = index
}
</script>

<style lang="scss" scoped>
@import '../css/global.scss';
@import '../css/set.scss';

.block {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: var(--ttime-color-background);
  box-shadow: 1px 1px 4px -1px var(--ttime-box-shadow-color);
  border: solid 1px var(--ttime-translate-border-color);

  .menu-icon {
    margin-right: 10px;
  }
}
// 设置宽度不完全百分百 否则内容会和滚动条重叠
:deep(.el-scrollbar__wrap) {
  width: 98%;
}
</style>
