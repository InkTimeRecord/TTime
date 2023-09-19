<template>
  <template v-if='isMemberVip()'>
    <el-tooltip placement='bottom-start'>
      <template #content>设置密钥</template>
      <div class='translate-service-edit-button'>
        <el-button :icon='Key' size='small' @click='vipInfoServiceRef.translateServiceKeyShowFun' />
      </div>
    </el-tooltip>
    <el-tooltip placement='bottom-start'>
      <template #content>刷新列表</template>
      <div class='translate-service-edit-button'>
        <el-button :icon='Refresh' size='small' @click='loadNewServiceInfoFun' />
      </div>
    </el-tooltip>
    <el-tooltip placement='bottom-start'>
      <template #content>查看备份历史</template>
      <div class='translate-service-edit-button'>
        <el-button :icon='Clock' size='small' @click='vipInfoServiceRef.translateServiceInfoRecordShowFun' />
      </div>
    </el-tooltip>
  </template>

  <vip-info-service ref='vipInfoServiceRef' :service-type='serviceType' />

</template>
<script setup lang='ts'>
import { ref } from 'vue'
import { ServiceTypeEnum } from '../../../../../../../common/enums/ServiceTypeEnum'
import { isMemberVip, loadNewServiceInfo } from '../../../../../utils/memberUtil'
import { Clock, Key, Refresh } from '@element-plus/icons-vue'
import VipInfoService from './VipInfoService.vue'
import { isNull } from '../../../../../../../common/utils/validate'
import ElMessageExtend from '../../../../../utils/messageExtend'
import { cacheGet } from '../../../../../utils/cacheUtil'

const props = defineProps({
  serviceType: {
    type: ServiceTypeEnum
  }
})

// 会员功能服务
const vipInfoServiceRef = ref('')

const loadNewServiceInfoFun = (): void => {
  if (isNull(cacheGet('translateServiceKey'))) {
    ElMessageExtend.warning('请在设置密钥后再进行操作')
    return
  }
  loadNewServiceInfo()
}

</script>

<style lang='scss' scoped>
.translate-service-edit-button {
  margin-right: 10px;
}
</style>
