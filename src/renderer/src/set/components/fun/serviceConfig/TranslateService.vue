<template>
  <div class='translate-service-layer'>
    <div class='translate-service-div-block'>
      <ul class='translate-service-list-block'>
        <el-scrollbar>
          <draggable
            v-model='translateServiceList'
            group='people'
            chosen-class='chosen'
            item-key='id'
            animation='300'
            @change='translateServiceSortDragChange'
          >
            <template #item='{ element }'>
              <li
                class='translate-service-block cursor-pointer none-select'
                :class='{ active: translateServiceThis.id === element.id }'
                @click='selectTranslateService(element)'
              >
                <a class='translate-service-block none-select translate-service-expansion-block'>
                  <div class='left'>
                    <img
                      class='translate-service-logo none-select'
                      :src='element.serviceInfo.logo'
                    />
                    <span class='translate-service-name none-select'>{{
                        element.serviceName
                      }}</span>
                  </div>
                  <div class='right'>
                    <el-switch
                      v-model='element.useStatus'
                      @change='translateServiceUseStatusChange(element)'
                    />
                  </div>
                </a>
              </li>
            </template>
          </draggable>
        </el-scrollbar>
      </ul>
      <div class='translate-service-edit'>
        <div class='translate-service-edit-button'>
          <el-tooltip placement='bottom-start'>
            <template #content>添加翻译源</template>
            <el-dropdown trigger='click' max-height='490px'>
              <el-button :icon='Plus' size='small' />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for='(translateServiceSelectMenu, key) in translateServiceSelectMenuList'
                    :key='key'
                    :divided='translateServiceSelectMenu.dividedStatus'
                    @click='addTranslateService(translateServiceSelectMenu.type)'
                  >
                    {{ translateServiceSelectMenu.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </div>
        <el-tooltip placement='bottom-start'>
          <template #content>删除翻译源</template>
          <div class='translate-service-edit-button'>
            <el-button :icon='Minus' size='small' @click='deleteTranslateService' />
          </div>
        </el-tooltip>
        <el-tooltip v-if='isMemberVip' placement='bottom-start'>
          <template #content>设置密钥</template>
          <div class='translate-service-edit-button'>
            <el-button :icon='Key' size='small' @click='translateServiceKeyShowFun' />
          </div>
        </el-tooltip>
        <el-tooltip placement='bottom-start'>
          <template #content>刷新列表</template>
          <div class='translate-service-edit-button'>
            <el-button :icon='Refresh' size='small' @click='loadNewServiceInfo' />
          </div>
        </el-tooltip>
        <el-tooltip v-if='isMemberVip' placement='bottom-start'>
          <template #content>查看备份历史</template>
          <div class='translate-service-edit-button'>
            <el-button :icon='Clock' size='small' @click='translateServiceInfoRecordShowFun' />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class='translate-service-set-block'>
      <div class='translate-service-set'>
        <el-form v-if='!translateServiceThis.isBuiltIn' label-width='80px' label-position='left'>
          <el-form-item label='名称'>
            <el-input
              v-model='translateServiceThis.serviceName'
              type='text'
              spellcheck='false'
              @input='serviceNameInput'
            />
          </el-form-item>

          <el-form-item
            v-if='translateServiceThis.type === TranslateServiceEnum.OPEN_AI'
            label='请求地址'
          >
            <el-input
              v-model='translateServiceThis.requestUrl'
              type='text'
              placeholder='https://api.openai.com'
              spellcheck='false'
            />
            <span class='form-switch-span'> 留空默认：https://api.openai.com </span>
          </el-form-item>
          <el-form-item
            v-if='
              translateServiceThis.type === TranslateServiceEnum.OPEN_AI ||
              translateServiceThis.type === TranslateServiceEnum.AZURE_OPEN_AI
            '
            label='模型'
          >
            <el-select v-model='translateServiceThis.model' size='small'>
              <el-option
                v-for='model in openAIModelList'
                :key='model.value'
                :label='model.label'
                :value='model.value'
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if='
              !TranslateServiceBuilder.getServiceConfigInfo(translateServiceThis.type).isOneAppKey
            '
            label='AppId'
          >
            <el-input
              v-model='translateServiceThis.appId'
              type='password'
              show-password
              placeholder='请输入AppId'
              spellcheck='false'
            />
          </el-form-item>
          <el-form-item label='AppKey'>
            <el-input
              v-model='translateServiceThis.appKey'
              type='password'
              show-password
              placeholder='请输入密钥'
              spellcheck='false'
            />
          </el-form-item>

          <el-form-item
            v-if='translateServiceThis.type === TranslateServiceEnum.AZURE_OPEN_AI'
            label='请求地址'
          >
            <el-input v-model='translateServiceThis.endpoint' type='text' spellcheck='false' />
          </el-form-item>
          <el-form-item
            v-if='translateServiceThis.type === TranslateServiceEnum.AZURE_OPEN_AI'
            label='部署名称'
          >
            <el-input
              v-model='translateServiceThis.deploymentName'
              type='text'
              spellcheck='false'
            />
          </el-form-item>

          <div class='translate-service-set-fun'>
            <div class='translate-service-use-text'>
              <el-tag v-if='checkIngStatus' type='info' effect='dark'> 验证中...</el-tag>
              <el-tag v-else-if='translateServiceThis.checkStatus' type='success' effect='dark'
              >验证成功
              </el-tag>
              <el-tag v-else-if='!translateServiceThis.checkStatus' type='warning' effect='dark'
              >待验证
              </el-tag>
            </div>
            <el-button plain :disabled='checkIngStatus' @click='translateServiceCheckAndSave'
            >验证
            </el-button>
          </div>
          <span class='form-switch-span'> 验证成功后将会保存配置信息 </span>
        </el-form>
        <div v-else>
          <span class='form-switch-span'> 内置翻译源 - 无需配置 </span>
          <div
            v-if='
              translateServiceThis.type === TranslateServiceEnum.BING ||
              translateServiceThis.type === TranslateServiceEnum.BING_DICT
            '
            class='translate-service-bing-msg-block'
          >
            <el-divider />
            <span class='translate-service-bing-msg-title'>建议：</span>
            <span class='translate-service-bing-msg'>开启了Bing字典翻译源就不用再开启Bing翻译</span>
            <span class='translate-service-bing-msg'>Bing翻译 = Bing翻译</span>
            <span class='translate-service-bing-msg'>Bing字典 = Bing翻译 + Bing字典</span>
          </div>
        </div>
      </div>
    </div>
  </div>

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
              <el-button size='small' v-if='!scope.row.isNew' plain> 复制此备份</el-button>
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
import draggable from 'vuedraggable'
import { Clock, Key, Minus, Plus, Refresh } from '@element-plus/icons-vue'

import {
  buildTranslateService,
  getTranslateServiceMap,
  setTranslateServiceMap,
  TranslateServiceBuilder
} from '../../../../utils/translateServiceUtil'
import { isNotNull, isNotUrl, isNull } from '../../../../../../common/utils/validate'
import TranslateServiceEnum from '../../../../../../common/enums/TranslateServiceEnum'
import ElMessageExtend from '../../../../utils/messageExtend'
import { REnum } from '../../../../enums/REnum'
import { OpenAIModelEnum } from '../../../../../../common/enums/OpenAIModelEnum'
import { cacheGet, cacheSet } from '../../../../utils/cacheUtil'
import { dialogSetWinHandleStyle } from '../../../../utils/dialogUtil'
import { findHistoryList, findNewByInfo, updateByVersion, updateKey } from '../../../../api/user'
import { ServiceTypeEnum } from '../../../../../../common/enums/ServiceTypeEnum'
import { LoginStatusEnum } from '../../../../../../common/enums/LoginStatusEnum'
import { MemberTypeEnum } from '../../../../../../common/enums/MemberTypeEnum'
import { loadNewServiceInfo, saveServiceInfoHandle } from '../../../../utils/memberUtil'
import { NewStatusEnum } from '../../../../../../common/enums/NewStatusEnum'

/**
 * 更新登录状态
 */
const updateLoginStatus = (): void => {
  loginStatus.value = cacheGet('loginStatus')
  userInfo.value = cacheGet('userInfo')
}

const loginStatus = ref()
const userInfo = ref()

// 更新登录状态
updateLoginStatus()

// 窗口显示事件 当窗口显示时触发
window.api.winShowEvent(() => {
  // 更新登录状态
  updateLoginStatus()
})

// 刷新用户信息事件
window.api.refreshUserInfoEvent(() => {
  // 更新登录状态
  updateLoginStatus()
})

const isMemberVip = ref(
  loginStatus.value === LoginStatusEnum.Y && userInfo.value.memberType === MemberTypeEnum.VIP
)

// 翻译服务验证状态
const checkIngStatus = ref(false)

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
const handleCurrentChange = (pageIndex: number) => {
  historyPageInfo.value.pageIndex = pageIndex
  // 加载翻译源备份记录列表
  loadHistoryList()
}

/**
 * 加载翻译源备份记录列表
 */
const loadHistoryList = (): void => {
  if (!isMemberVip.value || isNull(translateServiceKey.value)) {
    return
  }
  findHistoryList({
    serviceType: ServiceTypeEnum.TRANSLATE,
    pageIndex: historyPageInfo.value.pageIndex,
    pageSize: historyPageInfo.value.pageSize,
    key: translateServiceKey.value
  }).then((data) => {
    historyList.value = data['rows']
    historyPageInfo.value.total = data['totalNumber']
  })
}

// 可添加的翻译源列表 先把 values 格式转换为数组
const translateServiceSelectMenuListTemp = Array.from(
  TranslateServiceBuilder.getServiceList().values()
)
// 这里获取翻译源对应的内置翻译源状态
translateServiceSelectMenuListTemp.forEach((service) => {
  service['isBuiltIn'] = buildTranslateService(service.type)?.['isBuiltIn']
})
// 根据内置状态进行排序分组
translateServiceSelectMenuListTemp.sort((a, b) => a['isBuiltIn'] - b['isBuiltIn'])
// 因为是否内置翻译源只有两种状态 是 与 否
// 获取第一条数据的内置状态
const lastIsBuiltIn = translateServiceSelectMenuListTemp[0]['isBuiltIn']
// 然后这里跳过第一条数据 往后开始寻找 与第一条内置状态不一致的则说明可以设置 分割状态标记了
for (let i = 1; i < translateServiceSelectMenuListTemp.length; i++) {
  if (translateServiceSelectMenuListTemp[i]['isBuiltIn'] !== lastIsBuiltIn) {
    // 因为需要对数据集进行内置与非内置的翻译源分组 所以这里需要对数据进行处理
    translateServiceSelectMenuListTemp[i]['dividedStatus'] = true
    break
  }
}

// 获取缓存中的翻译服务list
const translateServiceSelectMenuList = ref(translateServiceSelectMenuListTemp)

const openAIModelList = OpenAIModelEnum.MODEL_LIST

/**
 * 设置当前选中项默认为第一个翻译服务
 */
const selectOneTranslateServiceThis = (): void => {
  translateServiceThis.value = translateServiceMap.value.get(
    translateServiceMap.value.entries().next().value[0]
  )
}

// 获取缓存中的翻译服务list
const translateServiceMap = ref(getTranslateServiceMap())
// 获取缓存中的翻译服务list
const translateServiceList = ref([...translateServiceMap.value.values()])
// 当前选择的翻译服务
const translateServiceThis = ref()
// 设置当前选中项默认为第一个翻译服务
selectOneTranslateServiceThis()

/**
 * 选择翻译服务
 *
 * @param translateService 翻译服务
 */
const selectTranslateService = (translateService: any): void => {
  translateServiceThis.value = translateService
  // 开启翻译服务验证加载状态
  checkIngStatus.value = false
}

/**
 * 新增翻译服务
 *
 * @param type 翻译类型
 */
const addTranslateService = (type: string): void => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  for (const translateService of insideTranslateServiceMap.values()) {
    // 如果已经添加了内置服务 则不允许重复添加
    if (
      !TranslateServiceBuilder.getServiceConfigInfo(type).isKey &&
      type === translateService.type
    ) {
      ElMessageExtend.warning('此服务已存在了，请勿重复添加')
      return
    }
  }
  const service = buildTranslateService(type)
  if (null !== service) {
    saveTranslateService(service)
    translateServiceThis.value = service
  }
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
}

/**
 * 删除翻译服务
 */
const deleteTranslateService = (): void => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  if (insideTranslateServiceMap.size <= 1) {
    return ElMessageExtend.warning('不能删除所有翻译源')
  }
  insideTranslateServiceMap.delete(translateServiceThis.value.id)
  setTranslateServiceMap(insideTranslateServiceMap)
  // 更新页面绑定翻译服务数据
  updateThisTranslateServiceMap(insideTranslateServiceMap)
  // 设置当前选中项默认为第一个翻译服务
  selectOneTranslateServiceThis()
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
}

/**
 * 当前选择的翻译服务验证
 * 验证结果会通过调用返回给 apiCheckTranslateCallbackEvent 方法
 */
const translateServiceCheckAndSave = (): void => {
  const value = translateServiceThis.value
  if (
    (isNull(value.appId) &&
      !TranslateServiceBuilder.getServiceConfigInfo(value.type).isOneAppKey) ||
    isNull(value.appKey)
  ) {
    return ElMessageExtend.warning('请输入密钥信息后再进行验证')
  }
  if (TranslateServiceEnum.OPEN_AI === value.type) {
    if (isNotUrl(value.requestUrl)) {
      value.requestUrl = OpenAIModelEnum.REQUEST_URL
    } else {
      // 检查尾部的斜杠
      if (value.requestUrl.endsWith('/')) {
        // 移除尾部的斜杠
        value.requestUrl = value.requestUrl.slice(0, -1)
      }
    }
  }

  const info = {
    id: value.id,
    appId: value.appId,
    appKey: value.appKey
  }
  const defaultInfo = TranslateServiceBuilder.getServiceConfigInfo(value.type).defaultInfo
  if (isNotNull(defaultInfo)) {
    Object.keys(defaultInfo).forEach((key) => {
      info[key] = value[key]
    })
  }
  window.api.apiUniteTranslateCheck(value.type, info)
  // 开启翻译服务验证加载状态
  checkIngStatus.value = true
}

/**
 * 翻译服务验证回调 - translateServiceCheckAndSave 触发后结果回调到这里
 */
window.api.apiCheckTranslateCallbackEvent((type, res) => {
  // 关闭翻译服务验证加载状态
  checkIngStatus.value = false
  let useStatus: boolean
  let checkStatus: boolean
  if (res.code === REnum.SUCCESS) {
    useStatus = true
    checkStatus = true
    ElMessageExtend.success('验证通过 , 自动保存成功')
  } else if (res.code === REnum.ERROR) {
    useStatus = false
    checkStatus = false
    ElMessageExtend.warning(res.msg !== '' ? res.msg : '验证失败，请检查密钥是否可用')
  }
  const insideTranslateServiceMap = getTranslateServiceMap()
  const data = res.data
  const insideTranslateService = insideTranslateServiceMap.get(data.id)
  insideTranslateService.useStatus = useStatus
  insideTranslateService.checkStatus = checkStatus
  insideTranslateService.appId = data.appId
  insideTranslateService.appKey = data.appKey
  // 每个服务可能会有其他附带值 根据配置动态加载
  // 例如：OpenAI 会有模型选择
  const defaultInfo = TranslateServiceBuilder.getServiceConfigInfo(type).defaultInfo
  if (isNotNull(defaultInfo)) {
    Object.keys(defaultInfo).forEach((key) => {
      insideTranslateService[key] = data[key]
    })
  }
  // 验证成功后处理
  if (useStatus && checkStatus) {
    // 关闭其他已开启的相同类型翻译服务
    translateServiceCloseOtherSameTypesInUse(insideTranslateService)
  }
  saveTranslateService(insideTranslateService)
  if (translateServiceThis.value.id === insideTranslateService.id) {
    translateServiceThis.value = insideTranslateService
  }
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
})

/**
 * 翻译服务使用状态更改事件
 *
 * @param translateService 更改的翻译源信息
 */
const translateServiceUseStatusChange = (translateService): void => {
  if (translateService.useStatus && !translateService.checkStatus) {
    translateService.useStatus = false
    return ElMessageExtend.warning('未验证的服务无法使用')
  }
  // 关闭其他已开启的相同类型翻译服务
  translateServiceCloseOtherSameTypesInUse(translateService)
  // 保存翻译源更新的信息
  saveTranslateService(translateService)
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
}

/**
 * 关闭其他已开启的相同类型翻译服务
 *
 * @param translateService 当前开启的服务
 */
const translateServiceCloseOtherSameTypesInUse = (translateService): void => {
  for (const insideTranslateService of getTranslateServiceMap().values()) {
    if (
      insideTranslateService.type === translateService.type &&
      insideTranslateService.useStatus &&
      translateService.useStatus
    ) {
      insideTranslateService.useStatus = false
      saveTranslateService(insideTranslateService)
      break
    }
  }
}

/**
 * 保存翻译源
 *
 * @param translateService 翻译源
 */
const saveTranslateService = (translateService): void => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  insideTranslateServiceMap.set(translateService.id, translateService)
  setTranslateServiceMap(insideTranslateServiceMap)
  // 更新页面绑定翻译服务数据
  updateThisTranslateServiceMap(insideTranslateServiceMap)
}

/**
 * 服务排序拖动更改
 */
const translateServiceSortDragChange = (event): void => {
  const moved = event.moved
  // 将 Map 转换为数组
  const entries = Array.from(getTranslateServiceMap().entries())
    // 交换索引位置
  ;[entries[moved.oldIndex], entries[moved.newIndex]] = [
    entries[moved.newIndex],
    entries[moved.oldIndex]
  ]
  // 创建一个新的有序 Map
  const swappedMap = new Map(entries)
  setTranslateServiceMap(swappedMap)
  // 更新页面绑定翻译服务数据
  updateThisTranslateServiceMap(swappedMap)
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
}

/**
 * 更新页面绑定翻译服务数据
 *
 * @param newTranslateServiceMap 新翻译服务数据
 */
const updateThisTranslateServiceMap = (newTranslateServiceMap): void => {
  translateServiceMap.value = newTranslateServiceMap
  translateServiceList.value = [...translateServiceMap.value.values()]
}

/**
 * 服务名称输入监听
 */
const serviceNameInput = (): void => {
  // 保存翻译源更新的信息
  saveTranslateService(translateServiceThis.value)
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
  // 保存服务信息事件
  saveServiceInfoHandle()
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
      serviceType: ServiceTypeEnum.TRANSLATE,
      key: translateServiceKey.value
    }).then(() => {
      cacheSet('translateServiceKey', translateServiceKey.value)
      ElMessageExtend.success('保存成功')
      translateServiceKeyShow.value = false
    })
    return
  }
  updateKey({
    oldKey: oldKey,
    newKey: translateServiceKey.value
  }).then(() => {
    cacheSet('translateServiceKey', translateServiceKey.value)
    ElMessageExtend.success('保存成功')
    translateServiceKeyShow.value = false
    // 获取当前本地的进行一次保存 但是不用做最新的版本
    saveServiceInfoHandle(NewStatusEnum.N)
    // 加载服务端最新版本
    loadNewServiceInfo()
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
    serviceType: ServiceTypeEnum.TRANSLATE,
    id: id
  }).then(() => {
    translateServiceInfoRecordShow.value = false
    ElMessageExtend.success('切换成功')
  })
}

/**
 * 刷新服务信息事件
 */
window.api.refreshServiceInfoEvent(() => {
  updateThisTranslateServiceMap(getTranslateServiceMap())
  // 设置当前选中项默认为第一个翻译服务
  selectOneTranslateServiceThis()
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
})

</script>

<style lang='scss' scoped>
@import '../../../../css/set';

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.translate-service-layer {
  display: flex;
  max-height: 500px;
  min-height: 500px;

  .translate-service-div-block {
    .translate-service-edit {
      display: flex;
      align-items: center;
      margin-top: -6px;

      .translate-service-edit-button {
        margin-right: 10px;
      }
    }

    .translate-service-list-block {
      height: 460px;
      background: var(--ttime-translate-service-color-background);
      margin-top: 10px;
      border-radius: 8px;
      padding: 0;

      .translate-service-block {
        width: 210px;
        height: 60px;
        margin: 7px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .translate-service-expansion-block {
          display: flex;
          justify-content: space-between;
        }

        &:hover.translate-service-block:not(.active) {
          background: var(--ttime-translate-service-block-hover-background);
        }

        &.active {
          background: var(--ttime-translate-service-block-active-background);
        }

        .left {
          display: flex;
          align-items: center;
          justify-content: space-around;

          .translate-service-logo {
            width: 32px;
            border-radius: 8px;
          }

          .translate-service-name {
            max-width: 110px;
            font-size: 13px;
            padding-left: 5px;
            overflow: hidden;
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
        }

        .right {
        }
      }
    }
  }

  .translate-service-set-block {
    width: 360px;
    height: 460px;
    margin-left: 10px;
    background: var(--ttime-translate-service-color-background);
    margin-top: 10px;
    border-radius: 8px;

    .translate-service-set {
      padding: 30px 20px 20px 20px;

      .translate-service-set-fun {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .translate-service-use-text {
          font-size: 14px;
          padding-right: 10px;
        }
      }

      .translate-service-bing-msg-block {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        color: var(--ttime-tips-text-color);

        .translate-service-bing-msg-title {
          margin-top: 7px;
          font-weight: 600;
        }

        .translate-service-bing-msg {
          margin: 7px 0 0 10px;
        }
      }
    }
  }
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
