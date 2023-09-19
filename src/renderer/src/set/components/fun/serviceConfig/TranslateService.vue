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
            @change='serviceSortDragChange'
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
                      @change='serviceUseStatusChange(element)'
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

        <vip-info-service-buttons :service-type='ServiceTypeEnum.TRANSLATE' />

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
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { Minus, Plus } from '@element-plus/icons-vue'

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
import { loadNewServiceInfo, saveServiceInfoHandle } from '../../../../utils/memberUtil'
import VipInfoServiceButtons from './vip/VipInfoServiceButtons.vue'
import { ServiceTypeEnum } from '../../../../../../common/enums/ServiceTypeEnum'

// 翻译服务验证状态
const checkIngStatus = ref(false)

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
const selectOneServiceThis = (): void => {
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
selectOneServiceThis()

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
    saveService(service)
    translateServiceThis.value = service
  }
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
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
  updateThisServiceMap(insideTranslateServiceMap)
  // 设置当前选中项默认为第一个翻译服务
  selectOneServiceThis()
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
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
    serviceCloseOtherSameTypesInUse(insideTranslateService)
  }
  saveService(insideTranslateService)
  if (translateServiceThis.value.id === insideTranslateService.id) {
    translateServiceThis.value = insideTranslateService
  }
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
})

/**
 * 翻译服务使用状态更改事件
 *
 * @param translateService 更改的翻译源信息
 */
const serviceUseStatusChange = (translateService): void => {
  if (translateService.useStatus && !translateService.checkStatus) {
    translateService.useStatus = false
    return ElMessageExtend.warning('未验证的服务无法使用')
  }
  // 关闭其他已开启的相同类型翻译服务
  serviceCloseOtherSameTypesInUse(translateService)
  // 保存翻译源更新的信息
  saveService(translateService)
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
}

/**
 * 关闭其他已开启的相同类型翻译服务
 *
 * @param translateService 当前开启的服务
 */
const serviceCloseOtherSameTypesInUse = (translateService): void => {
  for (const insideTranslateService of getTranslateServiceMap().values()) {
    if (
      insideTranslateService.type === translateService.type &&
      insideTranslateService.useStatus &&
      translateService.useStatus
    ) {
      insideTranslateService.useStatus = false
      saveService(insideTranslateService)
      break
    }
  }
}

/**
 * 保存翻译源
 *
 * @param translateService 翻译源
 */
const saveService = (translateService): void => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  insideTranslateServiceMap.set(translateService.id, translateService)
  setTranslateServiceMap(insideTranslateServiceMap)
  // 更新页面绑定翻译服务数据
  updateThisServiceMap(insideTranslateServiceMap)
}

/**
 * 服务排序拖动更改
 */
const serviceSortDragChange = (event): void => {
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
  updateThisServiceMap(swappedMap)
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
}

/**
 * 更新页面绑定翻译服务数据
 *
 * @param newTranslateServiceMap 新翻译服务数据
 */
const updateThisServiceMap = (newTranslateServiceMap): void => {
  translateServiceMap.value = newTranslateServiceMap
  translateServiceList.value = [...translateServiceMap.value.values()]
}

/**
 * 服务名称输入监听
 */
const serviceNameInput = (): void => {
  // 保存翻译源更新的信息
  saveService(translateServiceThis.value)
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
  // 保存服务信息事件
  saveServiceInfoHandle(ServiceTypeEnum.TRANSLATE)
}

/**
 * 刷新服务信息事件
 */
window.api.refreshServiceInfoEvent(() => {
  updateThisServiceMap(getTranslateServiceMap())
  // 设置当前选中项默认为第一个服务
  selectOneServiceThis()
  // 更新翻译源通知
  window.api.updateTranslateServiceNotify()
})

loadNewServiceInfo()

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
</style>
