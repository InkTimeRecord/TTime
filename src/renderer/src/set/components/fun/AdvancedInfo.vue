<template>
  <el-form :model="basiInfo" label-width="150px">
    <span class="group-title-span none-select"> 翻译设置 </span>
    <el-divider />
    <el-form-item class="none-select" label="语音播放源">
      <el-tooltip placement="bottom-start">
        <template #content>
          除了TTime播放源以外其他语音播放源来自第三方，需要网络调用<br />当网速过慢时，可能会出现点击没反应的情况，一般都是因为网络延迟造成</template
        >
        <el-icon class="set-page-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class="comment-wrap-block">
        <el-radio-group v-model="basiInfo.playSpeechService" @change="playSpeechServiceEvent">
          <el-radio :label="PlaySpeechServiceEnum.TTIME">TTime</el-radio>
          <el-radio :label="PlaySpeechServiceEnum.YOUDAO">网易有道</el-radio>
          <el-radio :label="PlaySpeechServiceEnum.SOGOU">搜狗</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item class="none-select" label="文本处理">
      <el-checkbox
        v-model="advancedSettingInfo.wrapReplaceSpaceStatus"
        @change="wrapReplaceSpaceStatusEvent"
      />
      <span class="form-switch-span none-select"> 将翻译结果的 [ 换行符 ] 替换为 [ 空格 ] </span>
    </el-form-item>

    <span class="group-title-span none-select"> OCR设置 </span>
    <el-divider />
    <el-form-item class="none-select" label="OCR文本处理">
      <el-checkbox
        v-model="advancedSettingInfo.ocrWrapReplaceSpaceStatus"
        @change="ocrWrapReplaceSpaceStatusEvent"
      />
      <span class="form-switch-span none-select"> 将OCR结果的 [ 换行符 ] 替换为 [ 空格 ] </span>
    </el-form-item>
    <el-form-item class="none-select" label="OCR结果写入剪切板">
      <el-checkbox
        v-model="advancedSettingInfo.ocrWriteClipboardStatus"
        @change="ocrWriteClipboardStatusEvent"
      />
      <span class="form-switch-span none-select"> 将OCR识别后的文字自动写入剪切板 </span>
    </el-form-item>

    <span class="group-title-span none-select"> 功能设置 </span>
    <el-divider />
    <el-form-item class="form-item-group none-select" label="鼠标悬浮球(Beta)">
      <el-checkbox
        v-model="advancedSettingInfo.hoverBallStatus"
        label="悬浮球取词"
        @change="hoverBallStatusEvent"
      />
      <span class="form-switch-span none-select">
        开启后，操作流程：鼠标双击需要翻译的词 -> 浮现TTime小图标 -> 点击翻译
      </span>
    </el-form-item>
    <el-form-item class="none-select">
      <div class="comment-wrap-block">
        <el-checkbox
          v-model="advancedSettingInfo.hoverBallEnhanceStatus"
          label="增强模式"
          @change="hoverBallEnhanceStatusEvent"
        />
        <span class="form-switch-span none-select">
          开启后，鼠标拖动非文本内容或双击非文本区域时不会出现悬浮球
        </span>
      </div>
    </el-form-item>
    <el-form-item class="none-select" label="窗口配置">
      <el-checkbox
        v-model="advancedSettingInfo.alwaysOnTopAllowEscStatus"
        label="置顶时允许隐藏窗口"
        @change="alwaysOnTopAllowEscStatusEvent"
      />
      <span class="form-switch-span none-select">
        开启后，当翻译 / OCR窗口置顶时，按ESC键依旧可隐藏窗口
      </span>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
// 翻译内容框内容
import { h, ref } from 'vue'
import { YesNoEnum } from '../../../enums/YesNoEnum'
import { PlaySpeechServiceEnum } from '../../../enums/PlaySpeechServiceEnum'
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'
import { ElMessageBox } from 'element-plus'

const basiInfo = ref({
  playSpeechService: cacheGetStr('playSpeechService')
})

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
  alwaysOnTopAllowEscStatus: cacheGetStr('alwaysOnTopAllowEscStatus') === YesNoEnum.Y,
  wrapReplaceSpaceStatus: cacheGetStr('wrapReplaceSpaceStatus') === YesNoEnum.Y,
  hoverBallStatus: cacheGetStr('hoverBallStatus') === YesNoEnum.Y,
  hoverBallEnhanceStatus: cacheGetStr('hoverBallEnhanceStatus') === YesNoEnum.Y,
  ocrWriteClipboardStatus: cacheGetStr('ocrWriteClipboardStatus') === YesNoEnum.Y,
  ocrWrapReplaceSpaceStatus: cacheGetStr('ocrWrapReplaceSpaceStatus') === YesNoEnum.Y
})

/**
 * 置顶时允许隐藏窗口选择事件
 *
 * @param val 置顶时允许隐藏窗口状态
 */
const alwaysOnTopAllowEscStatusEvent = (val): void => {
  cacheSetStr('alwaysOnTopAllowEscStatus', val ? YesNoEnum.Y : YesNoEnum.N)
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
 * OCR结果换行符替换为空格事件
 *
 * @param val 换行符替换为空格状态
 */
const ocrWrapReplaceSpaceStatusEvent = (val): void => {
  cacheSetStr('ocrWrapReplaceSpaceStatus', val ? YesNoEnum.Y : YesNoEnum.N)
  advancedSettingInfo.value.ocrWrapReplaceSpaceStatus = val
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
  if (val) {
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
    const el = document.querySelector('.el-overlay')
    if (el) {
      // 此处动态调整下遮罩 否则大小会超过窗口
      el['style'].cssText = 'width: 97.2%;margin-left: 13px;border-radius: 8px;'
    }
  }
  hoverBallEnhanceStatusEvent(val)
  cacheSetStr('hoverBallStatus', val ? YesNoEnum.Y : YesNoEnum.N)
  advancedSettingInfo.value.hoverBallStatus = val
}

/**
 * 悬浮球增强模式事件
 *
 * @param val 状态
 */
const hoverBallEnhanceStatusEvent = (val): void => {
  cacheSetStr('hoverBallEnhanceStatus', val ? YesNoEnum.Y : YesNoEnum.N)
  advancedSettingInfo.value.hoverBallEnhanceStatus = val
}
</script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.form-switch-span {
  margin-left: 5px;
}

.group-title-span {
  margin-left: 5px;
  font-size: 13px;
  color: var(--el-menu-text-color);
}

.comment-wrap-block {
  display: flex;
  flex-direction: column;
}

.form-item-group {
  margin-bottom: 0;
}

:deep(.el-divider--horizontal) {
  margin: 15px 0;
}

:deep(.el-checkbox) {
  margin-right: 10px;
}
</style>
