<template>
  <el-form :model='basiInfo' label-width='150px'>

    <el-form-item class='none-select' label='主题'>
      <el-radio-group v-model='basiInfo.theme' @change='toggleTheme'>
        <el-radio :label='ThemeTypeEnum.AUTO'>跟随系统</el-radio>
        <el-radio :label='ThemeTypeEnum.LIGHT'>明亮</el-radio>
        <el-radio :label='ThemeTypeEnum.DARK'>暗黑</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class='none-select' label='语言设置'>
      <el-select v-model='basiInfo.language'>
        <el-option label='简体中文' value='zh' />
      </el-select>
    </el-form-item>
    <el-form-item class='none-select' label='自动启动'>
      <el-switch v-model='basiInfo.autoLaunch' @change='autoLaunchEvent' />
      <span class='form-switch-span none-select'> 开机自动启动TTime翻译 </span>
    </el-form-item>
    <el-form-item class='none-select' label='自动检测新版本'>
      <el-switch v-model='basiInfo.autoUpdater' @change='autoUpdaterEvent' />
      <span class='form-switch-span none-select'> 会在软件启动时检测新版本 </span>
    </el-form-item>

    <el-divider />

    <el-form-item class='none-select' label='语音播放源'>
      <el-tooltip placement="bottom-start">
        <template #content> 除了TTime播放源以外其他语音播放源来自第三方，需要网络调用<br />当网速过慢时，可能会出现点击没反应的情况，一般都是因为网络延迟造成</template>
        <el-icon class='set-page-icon'><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class='play-speech-service-block'>
        <el-radio-group v-model='basiInfo.playSpeechService' @change='playSpeechServiceEvent'>
          <el-radio :label='PlaySpeechServiceEnum.TTIME'>TTime</el-radio>
          <el-radio :label='PlaySpeechServiceEnum.YOUDAO'>网易有道</el-radio>
          <el-radio :label='PlaySpeechServiceEnum.SOGOU'>搜狗</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item class='none-select' label='置顶时允许隐藏窗口'>
      <div class='play-speech-service-block'>
        <el-radio-group v-model='advancedSettingInfo.alwaysOnTopAllowEscStatus' @change='alwaysOnTopAllowEscStatusEvent'>
          <el-radio :label='YesNoEnum.Y'>开启</el-radio>
          <el-radio :label='YesNoEnum.N'>关闭</el-radio>
        </el-radio-group>
        <span class='form-switch-span none-select'> 开启后，当翻译窗口置顶时，按ESC键依旧可隐藏窗口 </span>
      </div>
    </el-form-item>

    <el-form-item class='none-select' label='文本处理'>
      <el-switch v-model='advancedSettingInfo.wrapReplaceSpaceStatus' @change='wrapReplaceSpaceStatusEvent' />
      <span class='form-switch-span none-select'> 将翻译结果的 [ 换行符 ] 替换为 [ 空格 ] </span>
    </el-form-item>

  </el-form>
</template>
<script setup lang='ts'>

// 翻译内容框内容
import { ref } from 'vue'
import { YesNoEnum } from '../../../enums/YesNoEnum'
import { ThemeTypeEnum } from '../../../enums/ThemeTypeEnum'
import { PlaySpeechServiceEnum } from '../../../enums/PlaySpeechServiceEnum'
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
  autoUpdater: cacheGetStr('autoUpdater') === YesNoEnum.Y,
  playSpeechService: cacheGetStr('playSpeechService')
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

/**
 * 播放语音源选择事件
 *
 * @param playSpeechService 播放服务类型
 */
const playSpeechServiceEvent = (playSpeechService): void => {
  cacheSetStr('playSpeechService', playSpeechService)
  basiInfo.value.playSpeechService = playSpeechService
}

/**
 * 翻译相关设置
 */
const advancedSettingInfo = ref({
  alwaysOnTopAllowEscStatus: cacheGetStr('alwaysOnTopAllowEscStatus'),
  wrapReplaceSpaceStatus: cacheGetStr('wrapReplaceSpaceStatus') === YesNoEnum.Y,
})

/**
 * 置顶时允许隐藏窗口选择事件
 *
 * @param val 置顶时允许隐藏窗口状态
 */
const alwaysOnTopAllowEscStatusEvent = (val): void => {
  cacheSetStr('alwaysOnTopAllowEscStatus', val)
  advancedSettingInfo.value.alwaysOnTopAllowEscStatus = val
  // 更新置顶时允许隐藏窗口选择事件通知
  window.api.alwaysOnTopAllowEscStatusNotify()
}

/**
 * 换行符替换为空格事件
 *
 * @param val 换行符替换为空格状态
 */
const wrapReplaceSpaceStatusEvent = (val): void => {
  cacheSetStr('wrapReplaceSpaceStatus', val ? YesNoEnum.Y : YesNoEnum.N)
  advancedSettingInfo.value.wrapReplaceSpaceStatus = val
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
