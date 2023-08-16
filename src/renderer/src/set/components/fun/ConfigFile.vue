<template>
  <div>
    <div class="prompt-layer none-select">
      <span class="prompt-span form-switch-span none-select"> 注：</span>
      <br />
      <span class="prompt-span form-switch-span none-select">
        配置文件不能放在TTime安装路径内，否则当卸载TTime时会被一并删除
      </span>
      <br />
      <span class="prompt-span form-switch-span none-select">
        移动配置：指的是移动配置存储的文件夹
      </span>
      <br />
      <span class="prompt-span form-switch-span none-select">
        切换配置：指的是选择已存在的配置文件
      </span>
    </div>

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
            <el-button @click="openFileSelection(StoreConfigFunType.MOVE, StoreType.CONFIG)">
              移动配置
            </el-button>
            <el-button @click="openFileSelection(StoreConfigFunType.SWITCH, StoreType.CONFIG)">
              切换配置
            </el-button>
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
            <el-button
              @click="openFileSelection(StoreConfigFunType.MOVE, StoreType.HISTORY_RECORD)"
            >
              移动配置
            </el-button>
            <el-button
              @click="openFileSelection(StoreConfigFunType.SWITCH, StoreType.HISTORY_RECORD)"
            >
              切换配置
            </el-button>
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
import { StoreConfigFunTypeEnum } from '../../../../../common/enums/StoreConfigFunTypeEnum'
import R from '../../../../../common/class/R'
import ElMessageExtend from '../../../utils/messageExtend'

const StoreType = ref(StoreTypeEnum)
const StoreConfigFunType = ref(StoreConfigFunTypeEnum)

// 配置路徑
const configPath = ref(cacheGetByType(StoreTypeEnum.SYSTEM, 'configPath'))
// 历史记录路径
const historyRecordPath = ref(cacheGetByType(StoreTypeEnum.SYSTEM, 'historyRecordPath'))

const openFileSelection = (storeConfigFunType, openFileSelectType): void => {
  window.api.openDirectoryDialog(storeConfigFunType, openFileSelectType)
}
window.api.openDirectoryDialogCallback((storeConfigFunType, storeType, directoryPath) => {
  const res = window.api.updateConfigInfoPath(storeConfigFunType, storeType, directoryPath)
  console.log(res)
  if (res.code === R.ERROR) {
    ElMessageExtend.warning(res.msg)
    return
  }
  directoryPath = res.data
  if (storeType === StoreTypeEnum.CONFIG) {
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

.prompt-layer {
  margin: 0 0 15px 22px;

  .prompt-span {
  }
}
</style>
