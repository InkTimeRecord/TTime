<template>
  <el-dialog v-model='translateServiceKeyShow' class='translateServiceKeyShow' title='加密密钥配置'>
    <span class='translate-service-key-prompt'>
      注意：由于翻译源通过加密存储在云端，所以密钥配置以后一定要记住，此配置只会保留在本地，一旦忘记将无法同步及找回翻译源信息
    </span>
    <el-input
      v-model='translateServiceKey'
      class='translate-service-input'
      type='password'
      placeholder='翻译服务加密密钥'
      show-password
    />
    <template #footer>
      <span class='dialog-footer'>
        <el-button @click='translateServiceKeyShow = false'>取消</el-button>
        <el-button type='primary' @click='translateServiceKeySave'> 保存 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model='translateServiceInfoRecordShow'
    class='translateServiceInfoRecordShow'
    title='备份记录'
    :width='500'
  >
    <el-table :data='historyList' style='width: 100%'>
      <el-table-column prop='createTime' label='创建时间' align='center' :width='180' />
      <el-table-column prop='isNew' label='最新配置' align='center' :width='100'>
        <template #default='scope'>
          <el-tag :type="scope.row.isNew ? 'success' : 'info'" effect='dark'>
            {{ scope.row.isNew ? '最新' : '历史' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作' align='center' :width='171'>
        <template #default='scope'>
          <el-popconfirm
            width='300'
            :hide-icon='true'
            confirm-button-text='确定'
            cancel-button-text='取消'
            title='确定复制此历史配置为最新吗?'
            @confirm='translateServiceInfoUpdateByVersion(scope.row.id)'
          >
            <template #reference>
              <el-button v-if='!scope.row.isNew' size='small' plain> 复制此备份</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size='historyPageInfo.pageSize'
      v-model:current-page='historyPageInfo.pageIndex'
      class='history-page-div'
      small
      background
      layout='prev, pager, next , total'
      :total='historyPageInfo.total'
      @current-change='handleCurrentChange'
    />
  </el-dialog>
</template>
<script setup lang='ts'>
import { ref } from 'vue'

import { isNull } from '../../../../../../../common/utils/validate'
import ElMessageExtend from '../../../../../utils/messageExtend'
import { cacheGet, cacheSet } from '../../../../../utils/cacheUtil'
import { dialogSetWinHandleStyle } from '../../../../../utils/dialogUtil'
import { findHistoryList, findNewByInfo, updateByVersion, updateKey } from '../../../../../api/user'
import { ServiceTypeEnum } from '../../../../../../../common/enums/ServiceTypeEnum'
import {
  initNewServiceInfo,
  isMemberVip,
  loadNewServiceInfo,
  saveServiceInfoHandle
} from '../../../../../utils/memberUtil'
import { NewStatusEnum } from '../../../../../../../common/enums/NewStatusEnum'

const props = defineProps({
  serviceType: {
    type: ServiceTypeEnum
  }
})

/**
 * 翻译服务密钥弹层 - 显示状态
 */
const translateServiceKeyShow = ref(false)

/**
 * 翻译服务密钥
 */
const translateServiceKey = ref(cacheGet('translateServiceKey'))

/**
 * 翻译服务配置同步记录弹层 - 显示状态
 */
const translateServiceInfoRecordShow = ref(false)

const historyList = ref([])

const historyPageInfo = ref({
  pageIndex: 1,
  pageSize: 3,
  total: 0
})

/**
 * 改变页码
 *
 * @param pageIndex 页码
 */
const handleCurrentChange = (pageIndex: number): void => {
  historyPageInfo.value.pageIndex = pageIndex
  // 加载翻译源备份记录列表
  loadHistoryList()
}

/**
 * 加载翻译源备份记录列表
 */
const loadHistoryList = (): void => {
  if (!isMemberVip() || isNull(translateServiceKey.value)) {
    return
  }
  findHistoryList({
    serviceType: props.serviceType,
    pageIndex: historyPageInfo.value.pageIndex,
    pageSize: historyPageInfo.value.pageSize,
    key: translateServiceKey.value
  }).then((data) => {
    historyList.value = data['rows']
    historyPageInfo.value.total = data['totalNumber']
  })
}

/**
 * 翻译服务密钥 - 弹层显示
 */
const translateServiceKeyShowFun = (): void => {
  translateServiceKeyShow.value = true
  // dialog 设置窗口样式更新
  dialogSetWinHandleStyle('translateServiceKeyShow')
}

/**
 * 翻译服务加密密钥保存
 */
const translateServiceKeySave = (): void => {
  const oldKey = cacheGet('translateServiceKey')
  if (isNull(oldKey)) {
    findNewByInfo({
      serviceType: props.serviceType,
      key: translateServiceKey.value
    }).then(() => {
      cacheSet('translateServiceKey', translateServiceKey.value)
      ElMessageExtend.success('保存成功')
      translateServiceKeyShow.value = false
      // 初始化最新版本服务信息
      initNewServiceInfo()
    })
    return
  }
  updateKey({
    oldKey: oldKey,
    newKey: translateServiceKey.value
  }).then(() => {
    cacheSet('translateServiceKey', translateServiceKey.value)
    // 初始化最新版本服务信息
    initNewServiceInfo()
    ElMessageExtend.success('保存成功')
    translateServiceKeyShow.value = false
  })
}

/**
 * 翻译服务备份历史记录 - 弹层显示
 */
const translateServiceInfoRecordShowFun = (): void => {
  if (isNull(translateServiceKey.value)) {
    ElMessageExtend.warning('请在设置密钥后再进行查看')
    return
  }
  // 加载翻译源备份记录列表
  loadHistoryList()
  translateServiceInfoRecordShow.value = true
  // dialog 设置窗口样式更新
  dialogSetWinHandleStyle('translateServiceInfoRecordShow')
}

/**
 * 翻译服务信息根据版本设置
 *
 * @param id 备份历史记录ID
 */
const translateServiceInfoUpdateByVersion = (id: number): void => {
  updateByVersion({
    serviceType: props.serviceType,
    id: id
  }).then(() => {
    translateServiceInfoRecordShow.value = false
    ElMessageExtend.success('切换成功')
    loadNewServiceInfo()
  })
}

defineExpose({
  translateServiceKeyShowFun,
  translateServiceInfoRecordShowFun
})

</script>

<style lang='scss' scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.translate-service-key-prompt {
  font-size: 12px;
  color: red;
}

.translate-service-input {
  margin-top: 10px;
}

.history-page-div {
  margin-top: 20px;
}
</style>
