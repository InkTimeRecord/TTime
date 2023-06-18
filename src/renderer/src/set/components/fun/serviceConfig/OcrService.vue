<template>
  <div class="translate-service-layer">
    <div class="translate-service-div-block">
      <ul class="translate-service-list-block">
        <el-scrollbar>
          <draggable
            v-model="ocrServiceList"
            group="people"
            chosen-class="chosen"
            item-key="id"
            animation="300"
            @change="ocrServiceSortDragChange"
          >
            <template #item="{ element }">
              <li
                class="translate-service-block cursor-pointer none-select"
                :class="{ active: ocrServiceThis.id === element.id }"
                @click="selectOcrService(element)"
              >
                <a
                  class="translate-service-block cursor-pointer none-select translate-service-expansion-block"
                >
                  <div class="left">
                    <img class="translate-service-logo" :src="element.logo" />
                    <span class="translate-service-name">{{ element.name }}</span>
                  </div>
                  <div class="right">
                    <el-switch
                      v-model="element.useStatus"
                      @change="ocrServiceUseStatusChange(element)"
                    />
                  </div>
                </a>
              </li>
            </template>
          </draggable>
        </el-scrollbar>
      </ul>
      <div class="translate-service-edit">
        <div class="translate-service-edit-button">
          <el-dropdown trigger="click" max-height="490px">
            <el-button :icon="Plus" size="small" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(ocrServiceSelectMenu, key) in ocrServiceSelectMenuList"
                  :key="key"
                  :divided="ocrServiceSelectMenu.dividedStatus"
                  @click="addOcrService(ocrServiceSelectMenu.type)"
                >
                  {{ ocrServiceSelectMenu.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="translate-service-edit-button">
          <el-button :icon="Minus" size="small" @click="deleteOcrService" />
        </div>
      </div>
    </div>
    <div class="translate-service-set-block">
      <div class="translate-service-set">
        <el-form v-if="!ocrServiceThis.isBuiltIn" label-width="80px" label-position="left">
          <el-form-item v-if="ocrServiceThis.type === OcrServiceEnum.VOLCANO" label="类型">
            <el-select
              v-model="ocrServiceThis.model"
              size="small"
              :placeholder="VolcanoOcrModelList[0].label"
            >
              <el-option
                v-for="model in VolcanoOcrModelList"
                :key="model.value"
                :label="model.label"
                :value="model.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="'AppId'">
            <el-input
              v-model="ocrServiceThis.appId"
              type="password"
              show-password
              placeholder="请输入AppId"
              spellcheck="false"
            />
          </el-form-item>
          <el-form-item :label="'AppKey'">
            <el-input
              v-model="ocrServiceThis.appKey"
              type="password"
              show-password
              placeholder="请输入密钥"
              spellcheck="false"
            />
          </el-form-item>
          <div class="translate-service-set-fun">
            <div class="translate-service-use-text">
              <el-tag v-if="checkIngStatus" type="info" effect="dark"> 验证中... </el-tag>
              <el-tag v-else-if="ocrServiceThis.checkStatus" type="success" effect="dark"
                >验证成功</el-tag
              >
              <el-tag v-else-if="!ocrServiceThis.checkStatus" type="warning" effect="dark"
                >待验证</el-tag
              >
            </div>
            <el-button plain :disabled="checkIngStatus" @click="ocrServiceCheckAndSave"
              >验证</el-button
            >
          </div>
          <span class="form-switch-span"> 验证成功后将会保存配置信息 </span>
        </el-form>
        <span v-else class="form-switch-span">内置文本识别 - 无需配置</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

import {
  buildOcrService,
  getOcrServiceMap,
  getOcrServiceMapByUse,
  setOcrServiceMap
} from '../../../../utils/ocrServiceUtil'
import { OcrServiceEnum } from '../../../../enums/OcrServiceEnum'
import ElMessageExtend from '../../../../utils/messageExtend'
import { REnum } from '../../../../enums/REnum'
import draggable from 'vuedraggable'
import { VolcanoOcrModelEnum } from '../../../../enums/VolcanoOcrModelEnum'
import { isNull } from '../../../../utils/validate'

// Ocr服务验证状态
const checkIngStatus = ref(false)
// 可添加的翻译源列表 先把 values 格式转换为数组
const ocrServiceSelectMenuListTemp = Array.from(OcrServiceEnum.getServiceList().values())
// 这里获取翻译源对应的内置翻译源状态
ocrServiceSelectMenuListTemp.forEach((service) => {
  service['isBuiltIn'] = buildOcrService(service.type)?.['isBuiltIn']
})
// 根据内置状态进行排序分组
ocrServiceSelectMenuListTemp.sort((a, b) => a['isBuiltIn'] - b['isBuiltIn'])
// 因为是否内置翻译源只有两种状态 是 与 否
// 获取第一条数据的内置状态
const lastIsBuiltIn = ocrServiceSelectMenuListTemp[0]['isBuiltIn']
// 然后这里跳过第一条数据 往后开始寻找 与第一条内置状态不一致的则说明可以设置 分割状态标记了
for (let i = 1; i < ocrServiceSelectMenuListTemp.length; i++) {
  if (ocrServiceSelectMenuListTemp[i]['isBuiltIn'] !== lastIsBuiltIn) {
    // 因为需要对数据集进行内置与非内置的翻译源分组 所以这里需要对数据进行处理
    ocrServiceSelectMenuListTemp[i]['dividedStatus'] = true
    break
  }
}
// 获取缓存中的Ocr服务list
const ocrServiceSelectMenuList = ref(ocrServiceSelectMenuListTemp)

const VolcanoOcrModelList = VolcanoOcrModelEnum.MODEL_LIST

/**
 * 设置当前选中项默认为第一个Ocr服务
 */
const selectOneOcrServiceThis = () => {
  ocrServiceThis.value = ocrServiceMap.value.get(ocrServiceMap.value.entries().next().value[0])
}

// 获取缓存中的Ocr服务list
const ocrServiceMap = ref(getOcrServiceMap())
// 获取缓存中的Ocr服务list
const ocrServiceList = ref([...ocrServiceMap.value.values()])
// 当前选择的Ocr服务
const ocrServiceThis = ref()
// 设置当前选择的Ocr服务默认为第一个
selectOneOcrServiceThis()

/**
 * 选择Ocr服务
 *
 * @param ocrService Ocr服务
 */
const selectOcrService = (ocrService) => {
  ocrServiceThis.value = ocrService
  // 开启Ocr服务验证加载状态
  checkIngStatus.value = false
}

/**
 * 新增Ocr服务
 *
 * @param type Ocr类型
 */
const addOcrService = (type) => {
  const insideOcrServiceMap = getOcrServiceMap()
  for (const ocrService of insideOcrServiceMap.values()) {
    // 如果已经添加过了TTimeOcr源 重复添加时提示
    if (OcrServiceEnum.TTIME === type && type === ocrService.type) {
      ElMessageExtend.warning('TTime Ocr已存在了，请勿重复添加')
      return
    }
    if (OcrServiceEnum.TTIME_ONLINE === type && type === ocrService.type) {
      ElMessageExtend.warning('TTime在线Ocr已存在了，请勿重复添加')
      return
    }
  }
  const service = buildOcrService(type)
  if (null !== service) {
    saveOcrService(service)
    ocrServiceThis.value = service
  }
}

/**
 * 删除Ocr服务
 */
const deleteOcrService = () => {
  const insideOcrServiceMap = getOcrServiceMap()
  if (insideOcrServiceMap.size <= 1) {
    return ElMessageExtend.warning('不能删除所有Ocr服务')
  }
  const ocrService = ocrServiceThis.value
  if (ocrService.type === OcrServiceEnum.TTIME) {
    return ElMessageExtend.warning('默认Ocr服务不能删除')
  }
  insideOcrServiceMap.delete(ocrService.id)
  setOcrServiceMap(insideOcrServiceMap)
  // 更新页面绑定翻译OCR数据
  updateThisOcrServiceMap(insideOcrServiceMap)
  // 设置当前选中项默认为第一个Ocr服务
  selectOneOcrServiceThis()
}

/**
 * 当前选择的Ocr服务验证
 * 验证结果会通过调用返回给 apiCheckOcrCallbackEvent 方法
 */
const ocrServiceCheckAndSave = () => {
  const value = ocrServiceThis.value
  window.api.apiUniteOcrCheck(value.type, {
    id: value.id,
    appId: value.appId,
    appKey: value.appKey,
    // 此参数 OpenAI 使用
    model: value.model
  })
  // 开启Ocr服务验证加载状态
  checkIngStatus.value = true
}

/**
 * Ocr服务验证回调 - ocrServiceCheckAndSave 触发后结果回调到这里
 */
window.api.apiCheckOcrCallbackEvent((type, res) => {
  // 关闭Ocr服务验证加载状态
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
  const insideOcrServiceMap = getOcrServiceMap()
  const data = res.data
  const insideOcrService = insideOcrServiceMap.get(data.id)
  insideOcrService.useStatus = useStatus
  insideOcrService.checkStatus = checkStatus
  insideOcrService.appId = data.appId
  insideOcrService.appKey = data.appKey
  if (OcrServiceEnum.VOLCANO === type) {
    insideOcrService.model = data.model
  }
  ocrServiceUseStatusChange(insideOcrService)
  if (ocrServiceThis.value.id === insideOcrService.id) {
    ocrServiceThis.value = insideOcrService
  }
})

/**
 * Ocr服务使用状态更改事件
 *
 * @param ocrService 更改的Ocr源信息
 */
const ocrServiceUseStatusChange = (ocrService) => {
  if (ocrService.useStatus && !ocrService.checkStatus) {
    ocrService.useStatus = false
    return ElMessageExtend.warning('未验证的服务无法使用')
  }
  for (const insideOcrService of getOcrServiceMap().values()) {
    if (insideOcrService.useStatus && ocrService.useStatus) {
      insideOcrService.useStatus = false
      saveOcrService(insideOcrService)
      break
    }
  }
  // 保存Ocr服务更新的信息
  saveOcrService(ocrService)
  // 校验当前可用Ocr服务是否为全部关闭
  if (getOcrServiceMapByUse().size <= 0) {
    if (ocrService.type === OcrServiceEnum.TTIME) {
      // 校验如果最后一个关闭的是TTie自带的的Ocr服务则进行提示
      ElMessageExtend.warning('不能关闭所有文本识别服务')
    }
    // 遍历所有Ocr服务 找到TTime自带的Ocr服务开启
    for (const insideOcrService of getOcrServiceMap().values()) {
      if (insideOcrService.type === OcrServiceEnum.TTIME && insideOcrService.isBuiltIn) {
        insideOcrService.useStatus = true
        saveOcrService(insideOcrService)
        break
      }
    }
  }
}

/**
 * 保存Ocr源
 *
 * @param ocrService Ocr源
 */
const saveOcrService = (ocrService) => {
  const insideOcrServiceMap = getOcrServiceMap()
  insideOcrServiceMap.set(ocrService.id, ocrService)
  setOcrServiceMap(insideOcrServiceMap)
  // 更新页面绑定翻译OCR数据
  updateThisOcrServiceMap(insideOcrServiceMap)
}

const ocrServiceSortDragChange = (event): void => {
  const moved = event.moved
  // 将 Map 转换为数组
  const entries = Array.from(getOcrServiceMap().entries())
  // 交换索引位置
  ;[entries[moved.oldIndex], entries[moved.newIndex]] = [
    entries[moved.newIndex],
    entries[moved.oldIndex]
  ]
  // 创建一个新的有序 Map
  const swappedMap = new Map(entries)
  setOcrServiceMap(swappedMap)
  // 更新页面绑定翻译OCR数据
  updateThisOcrServiceMap(swappedMap)
}

/**
 * 更新页面绑定OCR服务数据
 *
 * @param newOcrServiceMap 新OCR服务数据
 */
const updateThisOcrServiceMap = (newOcrServiceMap): void => {
  ocrServiceMap.value = newOcrServiceMap
  ocrServiceList.value = [...ocrServiceMap.value.values()]
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
            padding-left: 5px;
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
