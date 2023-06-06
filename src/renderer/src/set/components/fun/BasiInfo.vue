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

    <el-divider />

    <el-form-item class="none-select" label="语音播放源">
      <el-tooltip placement="bottom-start">
        <template #content>
          除了TTime播放源以外其他语音播放源来自第三方，需要网络调用<br />当网速过慢时，可能会出现点击没反应的情况，一般都是因为网络延迟造成</template
        >
        <el-icon class="set-page-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class="play-speech-service-block">
        <el-radio-group v-model="basiInfo.playSpeechService" @change="playSpeechServiceEvent">
          <el-radio :label="PlaySpeechServiceEnum.TTIME">TTime</el-radio>
          <el-radio :label="PlaySpeechServiceEnum.YOUDAO">网易有道</el-radio>
          <el-radio :label="PlaySpeechServiceEnum.SOGOU">搜狗</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>

    <el-form-item class="none-select" label="鼠标悬浮球取词(Beta)">
      <el-tooltip placement="bottom-start">
        <template #content>
          开启后，操作流程：鼠标双击需要翻译的词 -> 浮现TTime小图标 -> 点击翻译
          <br />
          注意：此功能正在测试试行阶段，目前仅支持Windows，如果使用过程中出现问题欢迎联系我们进行反馈修复
        </template>
        <el-icon class="set-page-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class="play-speech-service-block">
        <el-radio-group
          v-model="advancedSettingInfo.hoverBallStatus"
          @change="hoverBallStatusEvent"
        >
          <el-radio :label="YesNoEnum.Y">开启</el-radio>
          <el-radio :label="YesNoEnum.N">关闭</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>

    <el-form-item class="none-select" label="置顶时允许隐藏窗口">
      <div class="play-speech-service-block">
        <el-radio-group
          v-model="advancedSettingInfo.alwaysOnTopAllowEscStatus"
          @change="alwaysOnTopAllowEscStatusEvent"
        >
          <el-radio :label="YesNoEnum.Y">开启</el-radio>
          <el-radio :label="YesNoEnum.N">关闭</el-radio>
        </el-radio-group>
        <span class="form-switch-span none-select">
          开启后，当翻译窗口置顶时，按ESC键依旧可隐藏窗口
        </span>
      </div>
    </el-form-item>

    <el-form-item class="none-select" label="文本处理">
      <el-switch
        v-model="advancedSettingInfo.wrapReplaceSpaceStatus"
        @change="wrapReplaceSpaceStatusEvent"
      />
      <span class="form-switch-span none-select"> 将翻译结果的 [ 换行符 ] 替换为 [ 空格 ] </span>
    </el-form-item>

    <el-form-item class="none-select" label="OCR结果写入剪切板">
      <el-switch
        v-model="advancedSettingInfo.ocrWriteClipboardStatus"
        @change="ocrWriteClipboardStatusEvent"
      />
      <span class="form-switch-span none-select"> 将OCR识别后的文字自动写入剪切板 </span>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
// 翻译内容框内容
import { h, ref } from 'vue'
import { YesNoEnum } from '../../../enums/YesNoEnum'
import { ThemeTypeEnum } from '../../../enums/ThemeTypeEnum'
import { PlaySpeechServiceEnum } from '../../../enums/PlaySpeechServiceEnum'
import { initTheme } from '../../../utils/themeUtil'
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'
import { ElMessageBox } from 'element-plus'

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
  hoverBallStatus: cacheGetStr('hoverBallStatus'),
  ocrWriteClipboardStatus: cacheGetStr('ocrWriteClipboardStatus') === YesNoEnum.Y
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

/**
 * OCR结果写入剪切板
 *
 * @param val OCR结果写入剪切板状态
 */
const ocrWriteClipboardStatusEvent = (val): void => {
  cacheSetStr('ocrWriteClipboardStatus', val ? YesNoEnum.Y : YesNoEnum.N)
  advancedSettingInfo.value.ocrWriteClipboardStatus = val
}

/**
 * 鼠标悬浮球取词事件
 *
 * @param val 状态
 */
const hoverBallStatusEvent = (val): void => {
  if (val === YesNoEnum.Y) {
    ElMessageBox({
      title: '鼠标悬浮球取词(Beta)',
      message: h('p', null, [
        h('span', null, '开启后，操作流程：'),
        h('br', null, []),
        h('br', null, []),
        h('span', null, '鼠标双击需要翻译的词 -> 浮现TTime小图标 -> 点击翻译'),
        h('br', null, []),
        h('br', null, []),
        h(
          'span',
          null,
          '注意：此功能正在测试试行阶段，目前仅支持Windows，如果使用过程中出现问题欢迎联系我们进行反馈修复'
        )
      ])
    })
  }
  cacheSetStr('hoverBallStatus', val)
  advancedSettingInfo.value.hoverBallStatus = val
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
