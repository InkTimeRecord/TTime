<template>
  <el-form :model="basiInfo" label-width="150px">
    <el-form-item class="none-select" label="主题">
      <el-radio-group v-model="basiInfo.theme" @change="toggleTheme">
        <el-radio :label="ThemeTypeEnum.AUTO">跟随系统</el-radio>
        <el-radio :label="ThemeTypeEnum.LIGHT">明亮</el-radio>
        <el-radio :label="ThemeTypeEnum.DARK">暗黑</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="none-select" label="语言设置">
      <el-select v-model="basiInfo.language">
        <el-option label="简体中文" value="zh" />
      </el-select>
    </el-form-item>
    <el-form-item class="none-select" label="自动启动">
      <el-switch v-model="basiInfo.autoLaunch" @change="autoLaunchEvent" />
      <span class="form-switch-span none-select"> 开机自动启动TTime翻译 </span>
    </el-form-item>
    <el-form-item class="none-select" label="自动检测新版本">
      <el-switch v-model="basiInfo.autoUpdater" @change="autoUpdaterEvent" />
      <span class="form-switch-span none-select"> 会在软件启动时检测新版本 </span>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
// 翻译内容框内容
import { ref } from 'vue'
import { YesNoEnum } from '../../../enums/YesNoEnum'
import { ThemeTypeEnum } from '../../../enums/ThemeTypeEnum'
import { initTheme } from '../../../utils/themeUtil'
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'

// 初始化主题
const useThemeMode = initTheme()

/**
 * 切换主题
 *
 * @param themeType 主题类型
 */
const toggleTheme = (themeType) => {
  useThemeMode.value = themeType
}

const basiInfo = ref({
  theme: cacheGetStr('useTheme'),
  language: 'zh',
  autoLaunch: cacheGetStr('autoLaunch') === YesNoEnum.Y,
  autoUpdater: cacheGetStr('autoUpdater') === YesNoEnum.Y
})

/**
 * 开机自启事件
 *
 * @param autoLaunch 开机自启状态
 */
const autoLaunchEvent = (autoLaunch): void => {
  cacheSetStr('autoLaunch', autoLaunch ? YesNoEnum.Y : YesNoEnum.N)
  basiInfo.value.autoLaunch = autoLaunch
  window.api.autoLaunchEvent(autoLaunch)
}

/**
 * 自动更新事件
 *
 * @param autoUpdater 自动更新状态
 */
const autoUpdaterEvent = (autoUpdater): void => {
  cacheSetStr('autoUpdater', autoUpdater ? YesNoEnum.Y : YesNoEnum.N)
  basiInfo.value.autoUpdater = autoUpdater
  if (autoUpdater) {
    window.api.autoUpdaterSilenceStartCheckEvent()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.form-switch-span {
  margin-left: 5px;
}

.play-speech-service-block {
  display: flex;
  flex-direction: column;
}
</style>
