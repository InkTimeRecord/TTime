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
                  <span class="translate-service-name none-select">{{
                    element.translateContent
                  }}</span>
                </div>
              </a>
            </li>
          </div>
        </el-scrollbar>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getTranslateRecordList } from '../../../utils/translateRecordUtil'

const translateRecordList = ref(getTranslateRecordList())
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
  translateRecordThis.value = translateRecord
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
