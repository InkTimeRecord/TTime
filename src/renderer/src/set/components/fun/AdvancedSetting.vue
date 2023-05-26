<template>
  <el-form :model='advancedSettingInfo' label-width='150px'>
    <el-form-item class='none-select' label='置顶时允许隐藏窗口'>
      <div class='play-speech-service-block'>
        <el-radio-group v-model='advancedSettingInfo.alwaysOnTopAllowEscStatus' @change='alwaysOnTopAllowEscStatusEvent'>
          <el-radio :label='YesNoEnum.Y'>开启</el-radio>
          <el-radio :label='YesNoEnum.N'>关闭</el-radio>
        </el-radio-group>
        <span class='form-switch-span none-select'> 开启后当翻译窗口置顶时，按下ESC键可退出 </span>
      </div>
    </el-form-item>
  </el-form>
</template>
<script setup lang='ts'>

// 翻译内容框内容
import { ref } from 'vue'
import { YesNoEnum } from '../../../enums/YesNoEnum'
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'


const advancedSettingInfo = ref({
  alwaysOnTopAllowEscStatus: cacheGetStr('alwaysOnTopAllowEscStatus')
})

/**
 * 置顶时允许隐藏窗口选择事件
 *
 * @param val 置顶时允许隐藏窗口状态
 */
const alwaysOnTopAllowEscStatusEvent = (val): void => {
  cacheSetStr('alwaysOnTopAllowEscStatus', val)
  advancedSettingInfo.value.alwaysOnTopAllowEscStatus = val
}

</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

//.form-switch-span {
//  margin-left: 5px;
//}

.play-speech-service-block {
  display: flex;
  flex-direction: column;
}

</style>
