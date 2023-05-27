<template>
  <div class='translate-service-layer'>
    <div class='translate-service-div-block'>
      <div class='translate-service-list-block'>
        <el-scrollbar>
          <div v-for='(translateService, key) in translateServiceMap.values()' :key='key'
               class='translate-service-block cursor-pointer none-select'
               :class='{"active" : translateServiceThis.id === translateService.id}'
               @click='selectTranslateService(translateService)'
          >
            <a class='translate-service-block cursor-pointer none-select translate-service-expansion-block'>
              <div class='left'>
                <img class='translate-service-logo' :src='translateService.logo' />
                <span class='translate-service-name'>{{ translateService.name }}</span>
              </div>
              <div class='right'>
                <el-switch v-model='translateService.useStatus'
                           @change='translateServiceUseStatusChange(translateService)' />
              </div>
            </a>
          </div>
        </el-scrollbar>
      </div>
      <div class='translate-service-edit'>
        <div class='translate-service-edit-button'>
          <el-dropdown trigger='click'>
            <el-button :icon='Plus' size='small' />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for='(translateServiceSelectMenu, key) in translateServiceSelectMenuList'
                  :key='key'
                  @click='addTranslateService(translateServiceSelectMenu.type)'>
                  {{ translateServiceSelectMenu.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class='translate-service-edit-button'>
          <el-button @click='deleteTranslateService' :icon='Minus' size='small' />
        </div>
      </div>
    </div>
    <div class='translate-service-set-block'>
      <div class='translate-service-set'>

        <el-form v-if='!translateServiceThis.isBuiltIn' label-width='80px' label-position='left'>

          <el-form-item v-if='translateServiceThis.type === TranslateServiceEnum.OPEN_AI' label='模型'>
            <el-select v-model='translateServiceThis.model' size='small'>
              <el-option v-for='model in openAIModelList' :key='model.value' :label='model.label'
                         :value='model.value' />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if='
              translateServiceThis.type !== TranslateServiceEnum.GOOGLE &&
              translateServiceThis.type !== TranslateServiceEnum.DEEP_L &&
              translateServiceThis.type !== TranslateServiceEnum.OPEN_AI
              '
            :label='
              translateServiceThis.type === TranslateServiceEnum.TENCENT_CLOUD ? "SecretId" :
              translateServiceThis.type === TranslateServiceEnum.BAIDU ? "AppId" :
              translateServiceThis.type === TranslateServiceEnum.ALIYUN ? "KeyId" :
              translateServiceThis.type === TranslateServiceEnum.YOU_DAO ? "应用ID" :
              "AppId"
              '>
            <el-input v-model='translateServiceThis.appId' type='password' show-password placeholder='请输入AppId'
                      spellcheck='false' />
          </el-form-item>
          <el-form-item
            :label='
              translateServiceThis.type === TranslateServiceEnum.TENCENT_CLOUD ? "SecretKey" :
              translateServiceThis.type === TranslateServiceEnum.BAIDU ? "SecretKey" :
              translateServiceThis.type === TranslateServiceEnum.ALIYUN ? "KeySecret" :
              translateServiceThis.type === TranslateServiceEnum.GOOGLE ? "ApiKey" :
              translateServiceThis.type === TranslateServiceEnum.OPEN_AI ? "ApiKey" :
              translateServiceThis.type === TranslateServiceEnum.YOU_DAO ? "应用秘钥" :
               "AppKey"'>
            <el-input v-model='translateServiceThis.appKey' type='password' show-password placeholder='请输入密钥'
                      spellcheck='false' />
          </el-form-item>
          <div class='translate-service-set-fun'>
            <div class='translate-service-use-text'>
              <el-tag v-if='checkIngStatus' type='info' effect='dark'>
                验证中...
              </el-tag>
              <el-tag v-else-if='translateServiceThis.checkStatus' type='success' effect='dark'>验证成功</el-tag>
              <el-tag v-else-if='!translateServiceThis.checkStatus' type='warning' effect='dark'>待验证</el-tag>
            </div>
            <el-button plain :disabled='checkIngStatus' @click='translateServiceCheckAndSave'>验证</el-button>
          </div>
          <span class='form-switch-span'> 验证成功后将会保存配置信息 </span>
        </el-form>
        <span v-else class='form-switch-span'>内置翻译源 - 无需配置</span>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

import {
  buildAliyunService,
  buildBaiduService,
  buildDeepLService,
  buildGoogleService,
  buildOpenAIService,
  buildTencentCloudService,
  buildTTimeService,
  buildVolcanoService,
  buildYouDaoService,
  getTranslateServiceMap,
  setTranslateServiceMap
} from '../../../../utils/translateServiceUtil'
import { isNull } from '../../../../utils/validate'
import { TranslateServiceEnum } from '../../../../enums/TranslateServiceEnum'
import ElMessageExtend from '../../../../utils/messageExtend'
import { REnum } from '../../../../enums/REnum'
import { OpenAIModelEnum } from '../../../../enums/OpenAIModelEnum'

// 翻译服务验证状态
const checkIngStatus = ref(false)
// 获取缓存中的翻译服务list
const translateServiceSelectMenuList = ref([
  { type: TranslateServiceEnum.TTIME, name: 'TTime翻译' },
  { type: TranslateServiceEnum.TENCENT_CLOUD, name: '腾讯翻译君' },
  { type: TranslateServiceEnum.BAIDU, name: '百度翻译' },
  { type: TranslateServiceEnum.ALIYUN, name: '阿里翻译' },
  { type: TranslateServiceEnum.GOOGLE, name: 'Google翻译' },
  { type: TranslateServiceEnum.OPEN_AI, name: 'OpenAI翻译' },
  { type: TranslateServiceEnum.YOU_DAO, name: '有道翻译' },
  { type: TranslateServiceEnum.DEEP_L, name: 'DeepL翻译' },
  { type: TranslateServiceEnum.VOLCANO, name: '火山翻译' }
])
const openAIModelList = OpenAIModelEnum.MODEL_LIST

/**
 * 设置当前选中项默认为第一个翻译服务
 */
const selectOneTranslateServiceThis = () => {
  translateServiceThis.value = translateServiceMap.value.get(translateServiceMap.value.entries().next().value[0])
}

// 获取缓存中的翻译服务list
const translateServiceMap = ref(getTranslateServiceMap())
// 当前选择的翻译服务
const translateServiceThis = ref()
// 设置当前选择的翻译服务默认为第一个
selectOneTranslateServiceThis()

/**
 * 选择翻译服务
 *
 * @param translateService 翻译服务
 */
const selectTranslateService = (translateService) => {
  translateServiceThis.value = translateService
  // 开启翻译服务验证加载状态
  checkIngStatus.value = false
}

/**
 * 新增翻译服务
 *
 * @param type 翻译类型
 */
const addTranslateService = (type) => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  for (const translateService of insideTranslateServiceMap.values()) {
    // 如果已经添加过了TTime翻译源 重复添加时提示
    if ((TranslateServiceEnum.TTIME === type) && type === translateService.type) {
      ElMessageExtend.warning('TTime翻译源已存在了，请勿重复添加')
      return
    }
  }
  let service = null
  if (TranslateServiceEnum.TTIME === type) {
    service = buildTTimeService()
  } else if (TranslateServiceEnum.TENCENT_CLOUD === type) {
    service = buildTencentCloudService()
  } else if (TranslateServiceEnum.BAIDU === type) {
    service = buildBaiduService()
  } else if (TranslateServiceEnum.ALIYUN === type) {
    service = buildAliyunService()
  } else if (TranslateServiceEnum.GOOGLE === type) {
    service = buildGoogleService()
  } else if (TranslateServiceEnum.OPEN_AI === type) {
    service = buildOpenAIService()
  } else if (TranslateServiceEnum.YOU_DAO === type) {
    service = buildYouDaoService()
  } else if (TranslateServiceEnum.DEEP_L === type) {
    service = buildDeepLService()
  } else if (TranslateServiceEnum.VOLCANO === type) {
    service = buildVolcanoService()
  }
  if (null !== service) {
    saveTranslateService(service)
    translateServiceThis.value = service
  }
}

/**
 * 删除翻译服务
 */
const deleteTranslateService = () => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  if (insideTranslateServiceMap.size <= 1) {
    return ElMessageExtend.warning('不能删除所有翻译源')
  }
  insideTranslateServiceMap.delete(translateServiceThis.value.id)
  setTranslateServiceMap(insideTranslateServiceMap)
  translateServiceMap.value = insideTranslateServiceMap
  // 设置当前选中项默认为第一个翻译服务
  selectOneTranslateServiceThis()
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
}

/**
 * 当前选择的翻译服务验证
 * 验证结果会通过调用返回给 apiCheckTranslateCallbackEvent 方法
 */
const translateServiceCheckAndSave = () => {
  const value = translateServiceThis.value
  if (
    (isNull(value.appId) &&
      TranslateServiceEnum.GOOGLE !== value.type &&
      TranslateServiceEnum.DEEP_L !== value.type &&
      TranslateServiceEnum.OPEN_AI !== value.type
    )
    || (isNull(value.appKey))
  ) {
    return ElMessageExtend.warning('请输入密钥信息后再进行验证')
  }
  window.api.apiUniteTranslateCheck(value.type, {
    id: value.id,
    appId: value.appId,
    appKey: value.appKey,
    // 此参数 OpenAI 使用
    model: value.model
  })
  // 开启翻译服务验证加载状态
  checkIngStatus.value = true
}

/**
 * 翻译服务验证回调 - translateServiceCheckAndSave 触发后结果回调到这里
 */
window.api.apiCheckTranslateCallbackEvent((type, res) => {
  // 关闭翻译服务验证加载状态
  checkIngStatus.value = false
  let useStatus
  let checkStatus
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
  saveTranslateService(insideTranslateService)
  if (translateServiceThis.value.id === insideTranslateService.id) {
    translateServiceThis.value = insideTranslateService
  }
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
})

/**
 * 翻译服务使用状态更改事件
 *
 * @param translateService 更改的翻译源信息
 */
const translateServiceUseStatusChange = (translateService) => {
  if (translateService.useStatus && !translateService.checkStatus) {
    translateService.useStatus = false
    return ElMessageExtend.warning('未验证的服务无法使用')
  }
  for (const insideTranslateService of getTranslateServiceMap().values()) {
    if (
      insideTranslateService.type === translateService.type &&
      insideTranslateService.useStatus && translateService.useStatus
    ) {
      insideTranslateService.useStatus = false
      saveTranslateService(insideTranslateService)
      break
    }
  }

  // 保存翻译源更新的信息
  saveTranslateService(translateService)
  // 更新翻译源通知
  window.api.updateTranslateServiceEvent()
}

/**
 * 保存翻译源
 *
 * @param translateService 翻译源
 */
const saveTranslateService = (translateService) => {
  const insideTranslateServiceMap = getTranslateServiceMap()
  insideTranslateServiceMap.set(translateService.id, translateService)
  setTranslateServiceMap(insideTranslateServiceMap)
  translateServiceMap.value = insideTranslateServiceMap
}
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
      padding-top: 10px;

      .translate-service-edit-button {
        margin-right: 10px;
      }

    }

    .translate-service-list-block {
      height: 460px;
      background: var(--ttime-translate-service-color-background);
      margin-top: 10px;
      border-radius: 8px;

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
            font-size: 13px;
            padding-left: 8px;
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

    }

  }
}
</style>
