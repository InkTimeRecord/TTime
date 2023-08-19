<template>
  <div class="translate-service-layer">
    <div class="translate-service-div-block">
      <ul class="translate-service-list-block">
        <el-scrollbar>
          <div v-for="(element, key) in translateRecordList" :key="key">
            <li
              class="translate-service-block cursor-pointer none-select"
              :class="{ active: translateRecordThis.requestId === element.requestId }"
              @click="selectTranslateRecord(element)"
            >
              <a class="translate-service-block none-select translate-service-expansion-block">
                <div class="left">
                  <span class="translate-service-name none-select">
                    {{ element.translateContent }}
                  </span>
                </div>
              </a>
            </li>
          </div>
        </el-scrollbar>
      </ul>
    </div>
    <div class="translate-service-set-block">
      <div class="block-layer">
        <div class="content-block">
          <div class="content">
            <div class="content-input-block">
              <el-input
                ref="translateContentInputRef"
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getTranslateRecordList } from '../../../utils/translateRecordUtil'
import translate from '../../../utils/translate'
import HistoryResultContentChannel from './translateHistory/HistoryResultContentChannel.vue'

const translateRecordList = ref(getTranslateRecordList().slice().reverse())
const translateServiceRecordList = ref(translateRecordList.value.translateServiceRecordList)

console.log(translateRecordList.value)
// 当前选择的翻译服务
const translateRecordThis = ref()
/**
 * 设置当前选中项默认为第一个翻译服务
 */
const selectOneTranslateRecordThis = (): void => {
  translateRecordThis.value = translateRecordList.value[0]
}
selectOneTranslateRecordThis()

/**
 * 选择翻译记录
 *
 * @param translateRecord 翻译记录
 */
const selectTranslateRecord = (translateRecord): void => {
  translateServiceRecordList.value = []
  translateRecordThis.value = translateRecord
  setTimeout(() => {
    // 加入延迟 否则显示的还是旧内容
    translateServiceRecordList.value = translateRecord.translateServiceRecordList
  }, 1)
}

// 翻译输入框ref
const translateContentInputRef = ref()

/**
 * 播放语音
 *
 * @param text 播放的文字
 */
const playSpeech = (text): void => {
  translate.playSpeech(text)
}

/**
 * 文字写入到剪切板
 */
const textWriteShearPlate = (text): void => {
  translate.textWriteShearPlate(text)
}
</script>

<style lang="scss" scoped>
@import '../../../css/set';

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
        width: 186px;
        height: 39px;
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

@import '../../../css/translate.scss';

.content {
  margin-top: 10px;

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
