<template>
  <div>
    <div v-if="translateRecordSize === 0" class="no-init-layer">
      <el-result class="none-select" title="当前还没有翻译记录">
        <template #icon>
          <el-icon style="width: 70px">
            <Promotion />
          </el-icon>
        </template>
      </el-result>
    </div>
    <div v-else class="translate-history">
      <span class="prompt-span form-switch-span none-select">
        记录总数：{{ translateRecordSize }}
      </span>
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
          <div class="translate-service-edit">
            <div class="translate-service-edit-button">
              <el-button :icon="Refresh" size="small" @click="translateRecordListRefresh" />
            </div>
            <div class="translate-service-edit-button">
              <el-popconfirm
                width="220"
                icon-color="#53b21e"
                title="确认删除此记录吗?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteTranslateHistory"
              >
                <template #reference>
                  <el-button :icon="Minus" size="small" />
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
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
                    <a
                      class="function-tools"
                      @click="playSpeech(translateRecordThis.translateContent)"
                    >
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  getTranslateRecordList,
  getTranslateRecordSize,
  updateTranslateRecordList
} from '../../../utils/translateRecordUtil'
import translate from '../../../utils/translate'
import HistoryResultContentChannel from './history/HistoryResultContentChannel.vue'
import { Refresh, Minus } from '@element-plus/icons-vue'
import { isNull } from '../../../../../common/utils/validate'
import TranslateRecordVo from '../../../../../common/class/TranslateRecordVo'

// 翻译记录列表
const translateRecordList = ref()
// 翻译记录数
const translateRecordSize = ref()
// 当前选择的翻译记录
const translateRecordThis = ref(new TranslateRecordVo())
// 当前选择的翻译记录 - 翻译结果列表
const translateServiceRecordList = ref()

// 初始加载数据
const init = (): void => {
  translateRecordList.value = getTranslateRecordList().slice().reverse()
  translateRecordSize.value = getTranslateRecordSize()
}

// 初始加载数据
init()

// 设置窗口获取焦点事件
window.api.setWinFocusEvent(() => {
  const isNotRecord = translateRecordSize.value === 0
  init()
  // 如果一开始获取到的记录是0条 数据加载完毕后大于0条的情况下需要触发选择第一条数据
  if (isNotRecord && translateRecordSize.value > 0) {
    // 设置第一条数据为当前选中项
    selectOneTranslateRecordThis()
  }
})

/**
 * 选择翻译记录
 *
 * @param translateRecord 翻译记录
 */
const selectTranslateRecord = (translateRecord): void => {
  translateServiceRecordList.value = []
  translateRecordThis.value = isNull(translateRecord) ? new TranslateRecordVo() : translateRecord
  setTimeout(() => {
    // 加入延迟 否则显示的还是旧内容
    translateServiceRecordList.value = translateRecord?.translateServiceRecordList
  }, 1)
}

/**
 * 设置第一条数据为当前选中项
 */
const selectOneTranslateRecordThis = (): void => {
  const translateRecord = translateRecordList.value[0]
  selectTranslateRecord(translateRecord)
}
// 设置第一条数据为当前选中项
selectOneTranslateRecordThis()

/**
 * 刷新翻译记录
 */
const translateRecordListRefresh = (): void => {
  // 初始加载数据
  init()
  // 设置第一条数据为当前选中项
  selectOneTranslateRecordThis()
}

/**
 * 删除翻译记录
 */
const deleteTranslateHistory = (): void => {
  // 使用filter方法来创建一个新的数组，其中不包含id为2的对象
  translateRecordList.value = translateRecordList.value.filter((translateRecord) => {
    return translateRecord.requestId !== translateRecordThis.value.requestId
  })
  // 更新翻译记录
  updateTranslateRecordList(translateRecordList.value.slice().reverse())
  // 初始加载数据
  init()
  // 设置第一条数据为当前选中项
  selectOneTranslateRecordThis()
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
 * 文字写入到剪切板
 */
const textWriteShearPlate = (text): void => {
  translate.textWriteShearPlate(text)
}
</script>

<style lang="scss" scoped>
@import '../../../css/set';

.no-init-layer {
  margin-top: 130px;
}

.translate-history {
  display: flex;
  flex-direction: column;

  .prompt-span {
    padding-bottom: 10px;
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
        margin-top: 0;
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
              max-width: 161px;
              font-size: 13px;
              padding-left: 5px;
              overflow: hidden;
              -webkit-line-clamp: 1;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }

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
  }
}

@import '../../../css/translate.scss';

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
