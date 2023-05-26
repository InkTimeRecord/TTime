<template>
  <el-form :model='advancedSettingInfo' label-width='150px'>
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
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'

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
