<template>
  <div class="content content-history">
    <div class="content-input-block">
      <div class="function-tools-block content-header-block">
        <div class="content-tools-category">
          <img class="content-translate-logo none-select" :src="serviceInfo.logo" />
          <span class="content-translate-name none-select">
            {{ serviceInfo.name }}
          </span>
        </div>
        <div class="function-tools-category content-tools-category">
          <a class="function-tools content-tools" @click="showResultFun">
            <el-icon>
              <ArrowDown v-if="showResult" />
              <ArrowLeft v-else />
            </el-icon>
          </a>
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="showResult">
          <el-input
            v-model="translatedResultContent"
            class="content-input content-input-zero-padding-top"
            :readonly="true"
            spellcheck="false"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 10 }"
          />

          <div class="phonetic-layer">
            <div v-show="dictTranslatedResultExpand.isUs" class="phonetic-block">
              <span class="phonetic-type">美 </span>
              <span class="phonetic">[{{ dictTranslatedResultExpand.usPhonetic }}]</span>
              <a
                class="phonetic-function-play cursor-pointer"
                @click="playSpeechByUrl(dictTranslatedResultExpand.usSpeech)"
              >
                <svg-icon icon-class="play" class="phonetic-function-tools-icon" />
              </a>
            </div>
            <div v-show="dictTranslatedResultExpand.isUk" class="phonetic-block">
              <span class="phonetic-type">英 </span>
              <span class="phonetic">[{{ dictTranslatedResultExpand.ukPhonetic }}]</span>
              <a
                class="phonetic-function-play cursor-pointer"
                @click="playSpeechByUrl(dictTranslatedResultExpand.ukSpeech)"
              >
                <svg-icon icon-class="play" class="phonetic-function-tools-icon" />
              </a>
            </div>
          </div>

          <div v-show="dictTranslatedResultExpand.isExplainList" class="explain-layer">
            <span class="explain-title">其他释义</span>
            <div
              v-for="(explain, key) in dictTranslatedResultExpand.explainList"
              :key="key"
              class="explain-block"
            >
              <span class="explain-type">{{ explain.type }}</span>
              <span class="explain-content">{{ explain.content }}</span>
            </div>
          </div>

          <div v-show="dictTranslatedResultExpand.isWfs" class="explain-layer">
            <div
              v-for="(wfs, key) in dictTranslatedResultExpand.wfsList"
              :key="key"
              class="explain-block"
            >
              <span class="explain-type">{{ wfs.wf.name + ' ' }}</span>
              <span class="explain-content">{{ wfs.wf.value }}</span>
            </div>
          </div>

          <div class="function-tools-block">
            <a class="function-tools" @click="playSpeech(translatedResultContent)">
              <svg-icon icon-class="play" class="function-tools-icon" />
            </a>
            <a class="function-tools" @click="textWriteShearPlate(translatedResultContent)">
              <svg-icon icon-class="copy" class="function-tools-icon" />
            </a>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import translate from '../../../../utils/translate'
import { isNull } from '../../../../../../common/utils/validate'
import TranslateServiceRecordVo from '../../../../../../common/class/TranslateServiceRecordVo'
import { TranslateServiceBuilder } from '../../../../utils/translateServiceUtil'

// 翻译内容框内容
const props = defineProps<{
  translateServiceRecordVo: TranslateServiceRecordVo
}>()

const translateServiceRecordVoThis = ref(props.translateServiceRecordVo)

const serviceInfo = ref(
  TranslateServiceBuilder.getInfoByService(translateServiceRecordVoThis.value.translateServiceType)
)

/**
 * 监听 props.translateServiceRecordVo 数据变化
 *
 * 此处不监听的情况下 translateServiceRecordVoThis 不会更新
 */
watch(
  () => props.translateServiceRecordVo,
  (newTranslateServiceRecordVo) => {
    translateServiceRecordVoThis.value = newTranslateServiceRecordVo
  }
)

// 翻译结果
const translatedResultContent = ref('')
const dictTranslatedResultExpand = ref({})
// 是否正在加载翻译结果
const isResultLoading = ref(false)
// 显示翻译结果
const showResult = ref(false)

/**
 * 显示翻译结果
 */
const showResultFun = (): void => {
  if (isNull(translatedResultContent.value)) {
    // 如果翻译结果内容为空则不执行
    return
  }
  showResult.value = !showResult.value
}

/**
 * 播放语音
 *
 * @param url 播放语音服务
 */
const playSpeechByUrl = (url): void => {
  translate.playSpeechNewAudio(url)
}

/**
 * 播放语音
 *
 * @param text 播放的文字
 */
const playSpeech = (text): void => {
  translate.playSpeech(text)
}

/**
 * 文字写入到剪贴板
 */
const textWriteShearPlate = (text): void => {
  translate.textWriteShearPlate(text)
}
const init = (): void => {
  if (isNull(translateServiceRecordVoThis.value)) {
    return
  }
  const data = translateServiceRecordVoThis.value.translateVo
  if (isNull(data)) {
    return
  }
  const translateList: string | string[] = data['translateList']
  if (isNull(translateList)) {
    return
  }
  let translatedResultContentTemp = ''
  if (translateList instanceof Array) {
    translateList.forEach((data) => {
      translatedResultContentTemp += data + '\n'
    })
  } else {
    translatedResultContentTemp = translateList
  }
  translatedResultContentTemp = translatedResultContentTemp.slice(
    0,
    translatedResultContentTemp.length - 1
  )
  showResult.value = true
  isResultLoading.value = false
  translatedResultContent.value = translatedResultContentTemp

  let explainListDeal = []
  if (!isNull(data?.explains)) {
    explainListDeal = data.explains.map((explain) => {
      const regex = /^(\w+\.)\s*(.*)$/
      const matches = explain.match(regex)
      if (matches) {
        return {
          type: matches[1] + ' ',
          content: matches[2]
        }
      }
      // 处理没有词性的情况
      return {
        content: explain
      }
    })
  }

  const isUs = !isNull(data?.['usPhonetic'])
  const isUk = !isNull(data?.['ukPhonetic'])
  const isExplainList = explainListDeal?.length > 0
  const isWfs = !isNull(data?.['wfs']) && data['wfs']?.length > 0
  dictTranslatedResultExpand.value = {
    isUs,
    isUk,
    isExplainList,
    isWfs,
    usPhonetic: data['usPhonetic'],
    ukPhonetic: data['ukPhonetic'],
    usSpeech: data['usSpeech'],
    ukSpeech: data['ukSpeech'],
    wfsList: data['wfs'],
    explainList: explainListDeal
  }
}
init()
</script>

<style lang="scss" scoped>
@import '../../../../css/translate.scss';
.content {
  .content-input-block {
    margin: 0 12px 12px 12px;
    border-radius: 7px;
    background: var(--ttime-translate-input-color-background);

    .content-input {
      border: 0;
      outline: none;
      resize: none;
      width: 98%;
      font-size: 14px;
      padding: 10px 0 1px 10px;
    }

    .content-input-zero-padding-top {
      padding-top: 0;
    }
  }
}

.content-header-block {
  padding: 5px 5px 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 7px;
  background-color: var(--ttime-translate-input-header-color-background);

  .content-tools-category {
    display: flex;
    align-items: center;

    .content-tools {
      padding: 0 3.5px;
    }

    .content-translate-logo {
      height: 15px;
      border-radius: 3px;
    }

    .content-translate-name {
      margin: 0 5px 0 5px;
      font-size: 11px;
      font-weight: var(--ttime-translate-name-size);
      color: var(--ttime-text-color);
    }

    .content-translate-loading {
      height: 16px;
    }
  }
}

.phonetic-layer {
  display: flex;

  .phonetic-block {
    display: flex;
    margin: 5px 15px 5px 15px;

    .phonetic-type {
      margin-right: 5px;
      color: var(--ttime-translate-phonetic-type-color);
      font-size: smaller;
    }

    .phonetic {
      margin-right: 5px;
      color: var(--ttime-translate-phonetic-type-color);
      font-size: smaller;
    }

    .phonetic-function-play {
      .phonetic-function-tools-icon {
      }
    }
  }
}

.explain-layer {
  .explain-title {
    color: var(--ttime-translate-explain-title-color);
    font-size: smaller;
    margin-left: 15px;
  }

  .explain-block {
    margin: 5px 20px 5px 20px;

    .explain-type {
      color: var(--ttime-translate-explain-type-color);
      font-size: smaller;
    }

    .explain-content {
      color: var(--ttime-translate-explain-content-color);
      font-size: small;
    }
  }
}
</style>
