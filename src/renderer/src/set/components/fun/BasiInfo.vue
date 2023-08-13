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
    <el-form-item class="none-select" label="翻译窗口显示位置">
      <el-select
        v-model="basiInfo.translateShowPositionType"
        @change="translateShowPositionTypeSelectChange"
      >
        <el-option label="上一次位置" :value="TranslateShowPositionEnum.LAST_TIME" />
        <el-option label="跟随鼠标" :value="TranslateShowPositionEnum.FOLLOW_MOUSE" />
        <el-option label="距顶部模式" :value="TranslateShowPositionEnum.FROM_TOP" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show="basiInfo.translateShowPositionType === TranslateShowPositionEnum.FROM_TOP"
      class="none-select"
      label="距顶部百分比"
    >
      <el-input-number
        v-model="basiInfo.fromTopOfWindowPercentage"
        :min="1"
        :max="200"
        @change="fromTopOfWindowPercentageChange"
      />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
// 翻译内容框内容
import { ref } from 'vue'
import { YesNoEnum } from '../../../../../common/enums/YesNoEnum'
import { ThemeTypeEnum } from '../../../enums/ThemeTypeEnum'
import TranslateShowPositionEnum from '../../../../../common/enums/TranslateShowPositionEnum'
import { initTheme } from '../../../utils/themeUtil'
import { cacheGet, cacheSet } from '../../../utils/cacheUtil'

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
  theme: localStorage['useTheme'],
  language: 'zh',
  autoLaunch: cacheGet('autoLaunch') === YesNoEnum.Y,
  autoUpdater: cacheGet('autoUpdater') === YesNoEnum.Y,
  translateShowPositionType: cacheGet('translateShowPositionType'),
  fromTopOfWindowPercentage: cacheGet('fromTopOfWindowPercentage')
})

/**
 * 开机自启事件
 *
 * @param autoLaunch 开机自启状态
 */
const autoLaunchEvent = (autoLaunch): void => {
  cacheSet('autoLaunch', autoLaunch ? YesNoEnum.Y : YesNoEnum.N)
  basiInfo.value.autoLaunch = autoLaunch
  window.api.autoLaunchEvent(autoLaunch)
}

/**
 * 自动更新事件
 *
 * @param autoUpdater 自动更新状态
 */
const autoUpdaterEvent = (autoUpdater): void => {
  cacheSet('autoUpdater', autoUpdater ? YesNoEnum.Y : YesNoEnum.N)
  basiInfo.value.autoUpdater = autoUpdater
  if (autoUpdater) {
    window.api.autoUpdaterSilenceStartCheckEvent()
  }
}

/**
 * 翻译窗口显示位置类型 - 事件
 *
 * @param translateShowPositionType 翻译窗口显示位置类型
 */
const translateShowPositionTypeSelectChange = (translateShowPositionType): void => {
  cacheSet('translateShowPositionType', translateShowPositionType)
  basiInfo.value.translateShowPositionType = translateShowPositionType
}
/**
 * 翻译距离窗口顶部位置 - 事件
 *
 * @param fromTopOfWindowPercentage 翻译距离窗口顶部位置
 */
const fromTopOfWindowPercentageChange = (fromTopOfWindowPercentage): void => {
  cacheSet('fromTopOfWindowPercentage', fromTopOfWindowPercentage)
  basiInfo.value.fromTopOfWindowPercentage = fromTopOfWindowPercentage
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
