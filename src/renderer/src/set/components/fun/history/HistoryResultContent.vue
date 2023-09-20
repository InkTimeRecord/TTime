<template>
  <div class="translate-service-set-block">
    <div class="block-layer">
      <div class="content-block">
        <div class="content">
          <div class="content-input-block">
            <el-input
              v-model="translateRecordThis.translateContent"
              readonly
              class="content-input"
              spellcheck="false"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
              placeholder="请输入单词或文字"
            >
            </el-input>
            <div class="function-tools-block">
              <a class="function-tools" @click="playSpeech(translateRecordThis.translateContent)">
                <svg-icon icon-class="play" class="function-tools-icon" />
              </a>
              <a
                class="function-tools"
                @click="textWriteShearPlate(translateRecordThis.translateContent)"
              >
                <svg-icon icon-class="copy" class="function-tools-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="language-select-block">
        <div class="language-select">
          <a class="language-block language-block-left none-select">
            <div>
              {{ translateRecordThis.languageType }}
            </div>
          </a>

          <div class="function-tools-block language-exchange-block language-block">
            <a class="function-tools language-icon">
              <svg-icon icon-class="substitution" class="function-tools-icon" />
            </a>
          </div>

          <a class="language-block language-block-right none-select">
            <div>
              {{ translateRecordThis.languageResultType }}
            </div>
          </a>
        </div>
      </div>

      <div v-for="(value, key) in translateServiceRecordList" :key="key">
        <history-result-content-channel
          :key="value.translateServiceId"
          :translate-service-record-vo="value"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import translate from '../../../../utils/translate'
import HistoryResultContentChannel from './HistoryResultContentChannel.vue'
import TranslateRecordVo from '../../../../../../common/class/TranslateRecordVo'
import { isNull } from '../../../../../../common/utils/validate'

// 翻译内容框内容
const props = defineProps<{
  translateRecord: TranslateRecordVo
}>()

const translateRecordThis = ref(props.translateRecord)

const translateServiceRecordList = ref(
  props.translateRecord.translateServiceRecordList
)

/**
 * 监听 props.translateServiceRecordVo 数据变化
 *
 * 此处不监听的情况下 translateServiceRecordVoThis 不会更新
 */
watch(
  () => props.translateRecord,
  (translateRecord: TranslateRecordVo) => {
    translateServiceRecordList.value = []
    translateRecordThis.value = isNull(translateRecord) ? new TranslateRecordVo() : translateRecord
    setTimeout(() => {
      // 加入延迟 否则显示的还是旧内容
      translateServiceRecordList.value = translateRecord?.translateServiceRecordList
    }, 1)
  }
)

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

</script>

<style lang="scss" scoped>
@import '../../../../css/translate.scss';
.translate-service-set-block {
  width: 360px;
  height: 460px;
  margin-left: 10px;
  background: var(--ttime-translate-service-color-background);
  border-radius: 8px;

  .block-layer {
    overflow: auto;
    margin-top: 10px;
    max-height: 440px;
    overflow-x: hidden;
  }

  .block-layer::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .block-layer::-webkit-scrollbar-thumb {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    background-color: #c3c3c3;
  }

  .block-layer::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.content-block {
  margin-top: 10px;

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
        padding: 10px 0px 1px 10px;
      }

      .content-input-zero-padding-top {
        padding-top: 0;
      }
    }
  }
}

.language-select-block {
  margin: 0 12px 12px 12px;
  border-radius: 7px;
  background: var(--ttime-translate-input-color-background);
  text-align: center;

  .language-select {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .language-block {
    display: inline-block;
    font-size: 13px;
    color: var(--ttime-text-color);
  }

  .language-select-icon {
    margin-left: 10px;
  }

  .language-block-left {
    display: flex;
    align-items: center;
    width: 170px;
    justify-content: center;
  }

  .language-block-right {
    display: flex;
    align-items: center;
    width: 170px;
    justify-content: center;
  }

  .language-exchange-block {
    padding: 5px 15px;
  }
}

</style>
