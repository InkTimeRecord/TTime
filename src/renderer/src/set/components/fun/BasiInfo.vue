<template>
  <el-form :model='basilInfo' label-width='150px'>
    <el-form-item class='none-select' label='主题'>
      <el-radio-group v-model='basilInfo.theme' @change='toggleTheme'>
        <el-radio :label='ThemeTypeEnum.AUTO'>跟随系统</el-radio>
        <el-radio :label='ThemeTypeEnum.LIGHT'>明亮</el-radio>
        <el-radio :label='ThemeTypeEnum.DARK'>暗黑</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class='none-select' label='语言设置'>
      <el-select v-model='basilInfo.language'>
        <el-option label='简体中文' value='zh' />
      </el-select>
    </el-form-item>
    <el-form-item class='none-select' label='自动启动'>
      <el-switch v-model='basilInfo.autoLaunch' @change='autoLaunchEvent' />
      <span class='form-switch-span none-select'> 开机自动启动TTime翻译 </span>
    </el-form-item>
    <el-form-item class='none-select' label='自动检测新版本'>
      <el-switch v-model='basilInfo.autoUpdater' @change='autoUpdaterEvent' />
      <span class='form-switch-span none-select'> 会在软件启动时检测新版本 </span>
    </el-form-item>
    <el-form-item class='none-select' label='隐藏翻译输入框'>
      <el-switch v-model='basilInfo.hideTranslateInput' @change='hideTranslateInputEvent' />
      <span class='form-switch-span none-select'> 翻译窗口将不显示翻译输入框 </span>
    </el-form-item>
    <el-form-item class='none-select' label='隐藏语言选择栏'>
      <el-switch v-model='basilInfo.hideTranslateLanguage' @change='hideTranslateLanguageEvent' />
      <span class='form-switch-span none-select'> 翻译窗口将不显示语言选择栏 </span>
    </el-form-item>
    <el-form-item class='none-select' label='翻译窗口显示位置'>
      <el-select
        v-model='basilInfo.translateShowPositionType'
        @change='translateShowPositionTypeSelectChange'
      >
        <el-option label='上一次位置' :value='TranslateShowPositionEnum.LAST_TIME' />
        <el-option label='跟随鼠标' :value='TranslateShowPositionEnum.FOLLOW_MOUSE' />
        <el-option label='距顶部模式' :value='TranslateShowPositionEnum.FROM_TOP' />
      </el-select>
    </el-form-item>
    <el-form-item
      v-show='basilInfo.translateShowPositionType === TranslateShowPositionEnum.FROM_TOP'
      class='none-select'
      label='距顶部百分比'
    >
      <el-input-number
        v-model='basilInfo.fromTopOfWindowPercentage'
        :min='1'
        :max='200'
        @change='fromTopOfWindowPercentageChange'
      />
    </el-form-item>
    <el-form-item class='none-select' label='划词默认前后延迟'>
      <el-input-number
        v-model='basilInfo.translateChoiceDelay'
        :min='100'
        :max='1000'
        @change='translateChoiceDelayChange'
      />
      <span class='form-switch-span none-select'> 划词触发后等待延迟（数字越小速度越快） </span>
    </el-form-item>
    <el-form-item class='none-select' label='翻译窗口字体大小'>
      <el-input-number
        v-model='basilInfo.winFontSize'
        :min='10'
        :max='30'
        @change='winFontSizeChange'
      />
    </el-form-item>
  </el-form>
</template>
<script setup lang='ts'>
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
const toggleTheme = (themeType): void => {
  useThemeMode.value = themeType
}

const basilInfo = ref({
  theme: localStorage['useTheme'],
  language: 'zh',
  autoLaunch: cacheGet('autoLaunch') === YesNoEnum.Y,
  autoUpdater: cacheGet('autoUpdater') === YesNoEnum.Y,
  translateShowPositionType: cacheGet('translateShowPositionType'),
  fromTopOfWindowPercentage: cacheGet('fromTopOfWindowPercentage'),
  translateChoiceDelay: cacheGet('translateChoiceDelay'),
  winFontSize: cacheGet('winFontSize'),
  hideTranslateInput: cacheGet('hideTranslateInput') === YesNoEnum.Y,
  hideTranslateLanguage: cacheGet('hideTranslateLanguage') === YesNoEnum.Y,
})

/**
 * 开机自启事件
 *
 * @param autoLaunch 开机自启状态
 */
const autoLaunchEvent = (autoLaunch): void => {
  cacheSet('autoLaunch', autoLaunch ? YesNoEnum.Y : YesNoEnum.N)
  basilInfo.value.autoLaunch = autoLaunch
  window.api.autoLaunchEvent(autoLaunch)
}

/**
 * 自动更新事件
 *
 * @param autoUpdater 自动更新状态
 */
const autoUpdaterEvent = (autoUpdater): void => {
  cacheSet('autoUpdater', autoUpdater ? YesNoEnum.Y : YesNoEnum.N)
  basilInfo.value.autoUpdater = autoUpdater
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
  basilInfo.value.translateShowPositionType = translateShowPositionType
}
/**
 * 翻译距离窗口顶部位置 - 事件
 *
 * @param fromTopOfWindowPercentage 翻译距离窗口顶部位置
 */
const fromTopOfWindowPercentageChange = (fromTopOfWindowPercentage): void => {
  cacheSet('fromTopOfWindowPercentage', fromTopOfWindowPercentage)
  basilInfo.value.fromTopOfWindowPercentage = fromTopOfWindowPercentage
}
/**
 * 划词默认前后延迟 - 事件
 *
 * @param translateChoiceDelay 划词默认前后延迟
 */
const translateChoiceDelayChange = (translateChoiceDelay): void => {
  cacheSet('translateChoiceDelay', translateChoiceDelay)
  basilInfo.value.translateChoiceDelay = translateChoiceDelay
}
/**
 * 窗口字体大小 - 事件
 *
 * @param winFontSize 窗口字体大小
 */
const winFontSizeChange = (winFontSize): void => {
  cacheSet('winFontSize', winFontSize)
  basilInfo.value.winFontSize = winFontSize
  window.api.winFontSizeNotify()
}

/**
 * 隐藏翻译输入框 - 事件
 */
const hideTranslateInputEvent = (value: any): void => {
  cacheSet('hideTranslateInput', value ? YesNoEnum.Y : YesNoEnum.N)
  basilInfo.value.hideTranslateInput = value
}

/**
 * 隐藏语言选择栏 - 事件
 */
const hideTranslateLanguageEvent = (value: any): void => {
  cacheSet('hideTranslateLanguage', value ? YesNoEnum.Y : YesNoEnum.N)
  basilInfo.value.hideTranslateLanguage = value
}
</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

.form-switch-span {
  margin-left: 5px;
}

.play-speech-service-block {
  display: flex;
  flex-direction: column;
}
</style>
