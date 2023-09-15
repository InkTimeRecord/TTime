<template>
  <div class="block">
    <Header />

    <el-container style="height: 554px">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-active="menuIndex" @select="menuSelect">
            <el-menu-item index="myInfo">
              <span class="none-select">我的</span>
            </el-menu-item>
            <el-menu-item index="basiInfo">
              <span class="none-select">偏好设置</span>
            </el-menu-item>
            <el-menu-item index="advancedInfo">
              <span class="none-select">高级设置</span>
            </el-menu-item>
            <el-menu-item index="shortcutKey">
              <span class="none-select">全局快捷键设置</span>
            </el-menu-item>
            <el-menu-item index="translateHistory">
              <span class="none-select">翻译记录</span>
            </el-menu-item>
            <el-menu-item index="translateServiceConfig">
              <span class="none-select">翻译源设置</span>
            </el-menu-item>
            <el-menu-item index="networkSet">
              <span class="none-select">网络设置</span>
            </el-menu-item>
            <el-menu-item index="configFile">
              <span class="none-select">配置文件设置</span>
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
            <my-info v-if="menuIndex === 'myInfo'" />
            <basi-info v-if="menuIndex === 'basiInfo'" />
            <advanced-info v-else-if="menuIndex === 'advancedInfo'" />
            <shortcut-key v-else-if="menuIndex === 'shortcutKey'" />
            <translate-history v-else-if="menuIndex === 'translateHistory'" />
            <translate-service-config v-else-if="menuIndex === 'translateServiceConfig'" />
            <network-set v-else-if="menuIndex === 'networkSet'" />
            <config-file v-else-if="menuIndex === 'configFile'" />
            <about v-else-if="menuIndex === 'about'" />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
import MyInfo from './components/fun/MyInfo.vue'
import BasiInfo from './components/fun/BasiInfo.vue'
import AdvancedInfo from './components/fun/AdvancedInfo.vue'
import ShortcutKey from './components/fun/ShortcutKey.vue'
import TranslateHistory from './components/fun/TranslateHistory.vue'
import TranslateServiceConfig from './components/fun/TranslateServiceConfig.vue'
import NetworkSet from './components/fun/NetworkSet.vue'
import ConfigFile from './components/fun/ConfigFile.vue'
import About from './components/fun/About.vue'

import { ref } from 'vue'
import { cacheDelete, cacheGet } from '../utils/cacheUtil'
import { isNull } from '../../../common/utils/validate'

/**
 * 设置页面菜单索引
 */
const getPageMenuIndex = (): string => {
  // 设置页面菜单索引
  const setPageMenuIndex = cacheGet('setPageMenuIndex')
  // 读取后缓存数据
  cacheDelete('setPageMenuIndex')
  // 如果菜单索引为空则默认展示偏好设置
  return isNull(setPageMenuIndex) ? 'myInfo' : setPageMenuIndex
}

/**
 * 当前选择的菜单索引
 */
const menuIndex = ref(getPageMenuIndex())

/**
 * 菜单选择事件
 *
 * @param index 菜单key
 */
const menuSelect = (index): void => {
  menuIndex.value = index
}

// 窗口显示事件 当窗口显示时触发
window.api.winShowEvent(() => {
  // 设置页面菜单索引
  menuSelect(getPageMenuIndex())
})
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
