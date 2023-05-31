<template>
  <div class="translate-service-layer">
    <div class="translate-service-div-block">
      <div class="translate-service-list-block">
        <el-scrollbar>
          <div
            v-for="(translateService, key) in translateServiceMap.values()"
            :key="key"
            class="translate-service-block cursor-pointer none-select"
            :class="{ active: translateServiceThis.id === translateService.id }"
            @click="selectTranslateService(translateService)"
          >
            <a
              class="translate-service-block cursor-pointer none-select translate-service-expansion-block"
            >
              <div class="left">
                <img class="translate-service-logo" :src="translateService.logo" />
                <span class="translate-service-name">{{ translateService.name }}</span>
              </div>
              <div class="right">
                <el-switch
                  v-model="translateService.useStatus"
                  @change="translateServiceUseStatusChange(translateService)"
                />
              </div>
            </a>
          </div>
        </el-scrollbar>
      </div>
      <div class="translate-service-edit">
        <div class="translate-service-edit-button">
          <el-dropdown trigger="click">
            <el-button :icon="Plus" size="small" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(translateServiceSelectMenu, key) in translateServiceSelectMenuList"
                  :key="key"
                  :divided="translateServiceSelectMenu.dividedStatus"
                  @click="addTranslateService(translateServiceSelectMenu.type)"
                >
                  {{ translateServiceSelectMenu.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="translate-service-edit-button">
          <el-button :icon="Minus" size="small" @click="deleteTranslateService" />
        </div>
      </div>
    </div>
    <div class="translate-service-set-block">
      <div class="translate-service-set">
        <el-form v-if="!translateServiceThis.isBuiltIn" label-width="80px" label-position="left">
          <el-form-item
            v-if="translateServiceThis.type === TranslateServiceEnum.OPEN_AI"
            label="模型"
          >
            <el-select v-model="translateServiceThis.model" size="small">
              <el-option
                v-for="model in openAIModelList"
                :key="model.value"
                :label="model.label"
                :value="model.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="
              translateServiceThis.type !== TranslateServiceEnum.GOOGLE &&
              translateServiceThis.type !== TranslateServiceEnum.DEEP_L &&
              translateServiceThis.type !== TranslateServiceEnum.OPEN_AI
            "
            :label="'AppId'"
          >
            <el-input
              v-model="translateServiceThis.appId"
              type="password"
              show-password
              placeholder="请输入AppId"
              spellcheck="false"
            />
          </el-form-item>
          <el-form-item :label="'AppKey'">
            <el-input
              v-model="translateServiceThis.appKey"
              type="password"
              show-password
              placeholder="请输入密钥"
              spellcheck="false"
            />
          </el-form-item>
          <div class="translate-service-set-fun">
            <div class="translate-service-use-text">
              <el-tag v-if="checkIngStatus" type="info" effect="dark"> 验证中...</el-tag>
              <el-tag v-else-if="translateServiceThis.checkStatus" type="success" effect="dark"
                >验证成功
              </el-tag>
              <el-tag v-else-if="!translateServiceThis.checkStatus" type="warning" effect="dark"
                >待验证
              </el-tag>
            </div>
            <el-button plain :disabled="checkIngStatus" @click="translateServiceCheckAndSave"
              >验证
            </el-button>
          </div>
          <span class="form-switch-span"> 验证成功后将会保存配置信息 </span>
        </el-form>
        <div v-else>
          <span class="form-switch-span"> 内置翻译源 - 无需配置 </span>
          <div
            v-if="
              translateServiceThis.type === TranslateServiceEnum.BING ||
              translateServiceThis.type === TranslateServiceEnum.BING_DICT
            "
            class="translate-service-bing-msg-block"
          >
            <el-divider />
            <span class="translate-service-bing-msg-title">建议：</span>
            <span class="translate-service-bing-msg">开启了Bing字典翻译源就不用再开启Bing翻译</span>
            <span class="translate-service-bing-msg">Bing翻译 = Bing翻译</span>
            <span class="translate-service-bing-msg">Bing字典翻译 = Bing翻译 + Bing字典</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

import {
  buildTranslateService,
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

// 可添加的翻译源列表 先把 values 格式转换为数组
const translateServiceSelectMenuListTemp = Array.from(
  TranslateServiceEnum.getServiceList().values()
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
const selectOneTranslateServiceThis = () => {
  translateServiceThis.value = translateServiceMap.value.get(
    translateServiceMap.value.entries().next().value[0]
  )
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
    if (
      (TranslateServiceEnum.TTIME === type && type === translateService.type) ||
      (TranslateServiceEnum.BING === type && type === translateService.type) ||
      (TranslateServiceEnum.BING_DICT === type && type === translateService.type) ||
      (TranslateServiceEnum.GOOGLE_BUILT_IN === type && type === translateService.type)
    ) {
      ElMessageExtend.warning('此翻译源已存在了，请勿重复添加')
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
      TranslateServiceEnum.OPEN_AI !== value.type) ||
    isNull(value.appKey)
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
      insideTranslateService.useStatus &&
      translateService.useStatus
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

<style lang="scss" scoped>
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
