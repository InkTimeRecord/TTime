<template>
  <div class='content'>
    <div class='content-input-block'>
      <div class='function-tools-block content-header-block'>
        <div class='content-tools-category'>
          <img
            class='content-translate-logo none-select'
            :src='translateServiceThis.serviceInfo.logo'
          />
          <span class='content-translate-name none-select'>
            {{ translateServiceThis.serviceName }}
          </span>
          <img v-show='isResultLoading' class='content-translate-loading' :src='loadingImageSrc' />
        </div>
        <div class='function-tools-category content-tools-category'>
          <a class='function-tools content-tools' @click='showResultFun'>
            <el-icon>
              <ArrowDown v-if='showResult' />
              <ArrowLeft v-else />
            </el-icon>
          </a>
        </div>
      </div>
      <el-collapse-transition>
        <div v-show='showResult'>
          <el-input
            v-if='showResult'
            ref='translatedResultContentRef'
            v-model='translatedResultContent'
            class='content-input content-input-zero-padding-top'
            :readonly='true'
            spellcheck='false'
            type='textarea'
            autosize
          />

          <div class='phonetic-layer'>
            <div v-show='dictTranslatedResultExpand.isUs' class='phonetic-block'>
              <span class='phonetic-type'>美 </span>
              <span class='phonetic'>[{{ dictTranslatedResultExpand.usPhonetic }}]</span>
              <a
                class='phonetic-function-play cursor-pointer'
                @click='playSpeechByUrl(dictTranslatedResultExpand.usSpeech)'
              >
                <svg-icon icon-class='play' class='phonetic-function-tools-icon' />
              </a>
            </div>
            <div v-show='dictTranslatedResultExpand.isUk' class='phonetic-block'>
              <span class='phonetic-type'>英 </span>
              <span class='phonetic'>[{{ dictTranslatedResultExpand.ukPhonetic }}]</span>
              <a
                class='phonetic-function-play cursor-pointer'
                @click='playSpeechByUrl(dictTranslatedResultExpand.ukSpeech)'
              >
                <svg-icon icon-class='play' class='phonetic-function-tools-icon' />
              </a>
            </div>
          </div>

          <div v-show='dictTranslatedResultExpand.isExplainList' class='explain-layer'>
            <span class='explain-title'>其他释义</span>
            <div
              v-for='(explain, key) in dictTranslatedResultExpand.explainList'
              :key='key'
              class='explain-block'
            >
              <span class='explain-type'>{{ explain.type }}</span>
              <span class='explain-content'>{{ explain.content }}</span>
            </div>
          </div>

          <div v-show='dictTranslatedResultExpand.isWfs' class='explain-layer'>
            <div
              v-for='(wfs, key) in dictTranslatedResultExpand.wfsList'
              :key='key'
              class='explain-block'
            >
              <span class='explain-type'>{{ wfs.wf.name + ' ' }}</span>
              <span class='explain-content'>{{ wfs.wf.value }}</span>
            </div>
          </div>

          <div class='function-tools-block'>
            <a class='function-tools' @click='playSpeech(translatedResultContent)'>
              <svg-icon icon-class='play' class='function-tools-icon' />
            </a>
            <a class='function-tools' @click='textWriteShearPlate(translatedResultContent)'>
              <svg-icon icon-class='copy' class='function-tools-icon' />
            </a>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { nextTick, ref, watch } from 'vue'
import loadingImage from '../../../assets/loading.gif'
import translate from '../../../utils/translate'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import { isNull } from '../../../../../common/utils/validate'
import { OpenAIStatusEnum } from '../../../../../common/enums/OpenAIStatusEnum'
import { updateTranslateRecord } from '../../../utils/translateRecordUtil'

// 翻译内容框内容
const props = defineProps<{
  translateService: object
}>()

/**
 * 获取翻译服务回调方法名称
 *
 * @param translateService 翻译服务信息
 */
const getTranslateServiceBackEventName = (translateService): string => {
  return translateService.type.toLowerCase() + 'ApiTranslateCallbackEvent'
}

/**
 * 监听 props.translateService 数据变化
 *
 * 此处不监听的情况下 translateServiceThis 不会更新
 */
watch(
  () => props.translateService,
  (newTranslateService) => {
    translateServiceThis.value = newTranslateService
  }
)
// 加载loading
const loadingImageSrc = ref(loadingImage)
const translateServiceThis = ref(props.translateService)

// 翻译结果
const translatedResultContent = ref('')
const dictTranslatedResultExpand = ref({})
// 是否正在加载翻译结果
const isResultLoading = ref(false)
// 显示翻译结果
const showResult = ref(false)
// 翻译结果内容容器
const translatedResultContentRef = ref('')

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

/**
 * 翻译回调 - 异步处理
 */
window.api[getTranslateServiceBackEventName(props.translateService)]((res) => {
  const data = res.data
  const translateList = data['translateList']
  let translatedResultContentTemp = translateList.join('\n')
  if (
    TranslateServiceEnum.OPEN_AI === props.translateService['type'] ||
    TranslateServiceEnum.AZURE_OPEN_AI === props.translateService['type']
  ) {
    if (res.code === OpenAIStatusEnum.START) {
      translatedResultContent.value = ''
      return
    }
    if (res.code === OpenAIStatusEnum.END) {
      translatedResultContent.value += translatedResultContentTemp
      showResult.value = true
      isResultLoading.value = false
      data.translateList = [translatedResultContent.value]
      // 更新翻译记录
      updateTranslateRecord(data)
      return
    }
    translatedResultContent.value += translatedResultContentTemp
    showResult.value = true
    return
  }
  translatedResultContent.value = translatedResultContentTemp
  showResult.value = true
  isResultLoading.value = false

  // 更新翻译记录
  updateTranslateRecord(data)

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
})

/**
 * 设置翻译内容
 *
 * @param value 翻译内容
 */
const setTranslatedResultContent = (value): void => {
  translatedResultContent.value = value
  adjustTextareaHeight()
}

/**
 * 设置显示翻译结果状态
 *
 * @param value 显示翻译结果
 */
const setShowResult = (value): void => {
  showResult.value = value
}

/**
 * 设置显示翻译加载中状态
 *
 * @param value 加载中状态
 */
const setIsResultLoading = (value): void => {
  isResultLoading.value = value
}

/**
 * 清空翻译结果内容事件
 */
const clearTranslatedResultContentEvent = (): void => {
  isResultLoading.value = false
  showResult.value = false
  setTranslatedResultContent('')
}

/**
 * 重新计算翻译结果容器高度
 */
const adjustTextareaHeight = (): void => {
  if (isNull(translatedResultContentRef.value) || translatedResultContent.value.length < 100) {
    return
  }
  // 获取el-textarea的DOM元素
  const textarea = translatedResultContentRef.value.ref
  // 设置el-textarea的高度为自适应高度
  textarea.style.height = 'auto'
  // 立即重新计算高度
  textarea.style.height = textarea.scrollHeight + 'px'
}

/**
 * 翻译结果监听
 */
watch(translatedResultContent, () => {
  nextTick(() => {
    setTimeout(() => {
      adjustTextareaHeight()
    }, 100)
  })
})

/**
 * 窗口大小更新
 */
window.api.winSizeUpdate(() => {
  adjustTextareaHeight()
})

defineExpose({
  setTranslatedResultContent,
  clearTranslatedResultContentEvent,
  setShowResult,
  setIsResultLoading
})
</script>

<style lang='scss' scoped>
@import '../../../css/translate.scss';
@import '../../../css/translate-input.scss';

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
