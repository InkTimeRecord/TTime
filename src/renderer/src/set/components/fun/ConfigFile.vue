<template>
  <div>
    <div class="network-layer">
      <el-form label-width="120px">
        <el-form-item class="none-select" label="配置文件路径">
          <el-input
            v-model="configPath"
            class="path-input"
            type="text"
            placeholder="请选择配置文件路径"
            spellcheck="false"
            disabled
          />
          <span class="form-switch-span none-select">
            <el-button @click="openFileSelection(StoreType.CONFIG)"> 更改 </el-button>
          </span>
        </el-form-item>
        <el-form-item class="none-select" label="翻译记录路径">
          <el-input
            v-model="historyRecordPath"
            class="path-input"
            type="text"
            placeholder="请选择翻译记录路径"
            spellcheck="false"
            disabled
          />
          <span class="form-switch-span none-select">
            <el-button @click="openFileSelection(StoreType.HISTORY_RECORD)"> 更改 </el-button>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { cacheGetByType } from '../../../utils/cacheUtil'
import { StoreTypeEnum } from '../../../../../common/enums/StoreTypeEnum'
const StoreType = ref(StoreTypeEnum)

// 配置路徑
const configPath = ref(cacheGetByType(StoreTypeEnum.SYSTEM, 'configPath'))
// 历史记录路径
const historyRecordPath = ref(cacheGetByType(StoreTypeEnum.SYSTEM, 'historyRecordPath'))

const openFileSelection = (openFileSelectType): void => {
  window.api.openDirectoryDialog(openFileSelectType)
}
window.api.openDirectoryDialogCallback((storeType, directoryPath) => {
  if (storeType === StoreTypeEnum.CONFIG) {
    window.api.updateConfigInfoPath(storeType, directoryPath)
    configPath.value = directoryPath
  } else if (storeType === StoreTypeEnum.HISTORY_RECORD) {
    historyRecordPath.value = directoryPath
  }
})
</script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.path-input {
  width: 90%;
}

.form-switch-span {
  margin-top: 5px;
}
</style>
