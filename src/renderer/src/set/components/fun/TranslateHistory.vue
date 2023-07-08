<template>
  <div class="translate-service-layer">
    <div class="translate-service-div-block">
      <ul class="translate-service-list-block">
        <el-scrollbar>
          <el-table :data="filterTableData" @row-dblclick="translateRow" empty-text="您还没有历史哦！" style="background: var(--ttime-translate-service-color-background);width: 100%" height="460">
            <el-table-column label="单词" prop="translateValue" class-name="contentCss" />
            <el-table-column align="right" width="150" style="background: var(--ttime-translate-service-color-background)">
              <template #header>
                <el-input v-model="search" size="small" placeholder="搜索" />
              </template>
              <template #default="scope">
                <el-button link type="danger" size="small" @click.prevent="deleteRow(scope.$index)">
                  删除
                </el-button>
                <span @click="collection(scope.row)">
                  <svg-icon :icon-class="scope.row.collection?'collection-true':'collection-false'" class="function-tools-icon" />
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </ul>
    </div>
    <div class="translate-service-set-block">
<!--      {{dictTranslatedResultExpand}}-->
      <div class="content">
        <div v-for="item in dictTranslatedResultExpand.translateContent" class="content-input-block">
          <div class="function-tools-block content-header-block">
            <div class="content-tools-category">
<!--              {{item}}-->
              <img class="content-translate-logo none-select" :src="item.translateLogoSrc" />
              <span class="content-translate-name none-select">{{ item.translateName }}</span>
              <img v-show="isResultLoading" class="content-translate-loading" :src="loadingImageSrc" />
            </div>
          </div>
          <el-collapse-transition>
            <div>
              <div class="explain-layer">
                <span class="explain-title">{{item.translatedResultContent}}</span>
              </div>
              <div class="phonetic-layer">
                <div v-show="item.isUs" class="phonetic-block">
                  <span class="phonetic-type">美 </span>
                  <span class="phonetic">[{{ item.usPhonetic }}]</span>
                  <a
                    class="phonetic-function-play cursor-pointer"
                    @click="playSpeechByUrl(item.usSpeech)"
                  >
                    <svg-icon icon-class="play" class="phonetic-function-tools-icon" />
                  </a>
                </div>
                <div v-show="item.isUk" class="phonetic-block">
                  <span class="phonetic-type">英 </span>
                  <span class="phonetic">[{{ item.ukPhonetic }}]</span>
                  <a
                    class="phonetic-function-play cursor-pointer"
                    @click="playSpeechByUrl(item.ukSpeech)"
                  >
                    <svg-icon icon-class="play" class="phonetic-function-tools-icon" />
                  </a>
                </div>
              </div>

              <div v-show="item.isExplainList" class="explain-layer">
                <span class="explain-title">其他释义</span>
                <div
                  v-for="(explain, key) in item.explainList"
                  :key="key"
                  class="explain-block"
                >
                  <span class="explain-type">{{ explain.type }}</span>
                  <span class="explain-content">{{ explain.content }}</span>
                </div>
              </div>

              <div v-show="item.isWfs" class="explain-layer">
                <div
                  v-for="(wfs, key) in item.wfsList"
                  :key="key"
                  class="explain-block"
                >
                  <span class="explain-type">{{ wfs.wf.name + " " }}</span>
                  <span class="explain-content">{{ wfs.wf.value }}</span>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import translate from "../../../utils/translate";
import store from "../../../utils/storeUtil";

const loadingImageSrc = ref("../../../assets/loading.gif");
const translateService = ref();

const translateRow = (row)=>{
  dictTranslatedResultExpand.value = row;
}

const collection = (row)=>{
  row.collection = !row.collection;
  store.setObj(new Map().set("translate",tableData.value));
}

const x = () => {

};
const isResultLoading = ref(false);

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
  store.setObj(new Map().set("translate",tableData.value));
}

/**
 * 播放语音
 *
 * @param url 播放语音服务
 */
const playSpeechByUrl = (url): void => {
  translate.playSpeechNewAudio(url);
};

interface User {
  date: string;
  name: string;
  address: string;
}

const search = ref("");
const filterTableData = computed(() =>
  tableData.value.filter((data) => !search.value || data.translateValue.toLowerCase().includes(search.value.toLowerCase()))
);
const handleDelete = (index: number) => {
  filterTableData.value.splice(index, 1);
  console.log(filterTableData.value);
};

const translateContent = () => {
  let objByKey = store.getObjByKey("translate");
  return objByKey;
};

let tableData = ref(translateContent());

const dictTranslatedResultExpand = ref(translateContent());

</script>

<style lang="scss" scoped>
@import '../../../css/set';

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
<style lang="scss">
.contentCss{
  width: 125px;
  overflow: hidden;
  white-space: nowrap!important;
  text-overflow: ellipsis;
}

.el-table tr {
  background-color: transparent;
}
</style>
