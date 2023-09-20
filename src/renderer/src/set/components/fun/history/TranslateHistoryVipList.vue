<template>
  <div>
    <div v-if='pageInfo.total === 0' class='no-init-layer'>
      <el-result class='none-select' title='当前还没有翻译记录'>
        <template #icon>
          <el-icon style='width: 70px'>
            <Promotion />
          </el-icon>
        </template>
      </el-result>
    </div>
    <div v-else class='translate-history'>
      <span class='prompt-span form-switch-span none-select'>
        记录总数：{{ pageInfo.total }}
      </span>
      <div class='translate-service-layer'>
        <div class='translate-service-div-block'>
          <ul v-infinite-scroll='load'
              :infinite-scroll-disabled='listDisabled'
              :infinite-scroll-delay='500'
              class='translate-service-list-block'>
            <div v-for='(element, key) in translateRecordList' :key='key'>
              <li
                class='translate-service-block cursor-pointer none-select'
                :class='{ active: translateRecordThis.requestId === element.requestId }'
                @click='selectTranslateRecord(element)'
              >
                <a class='translate-service-block none-select translate-service-expansion-block'>
                  <div class='left'>
                      <span class='translate-service-name none-select'>
                        {{ element.translateContent }}
                      </span>
                  </div>
                </a>
              </li>
            </div>
            <p v-if='listLoading'>Loading...</p>
            <p v-if='listNoMore'>No more</p>
          </ul>
          <div class='translate-service-edit'>
            <div class='translate-service-edit-button'>
              <el-button :icon='Refresh' size='small' @click='translateRecordListRefresh' />
            </div>
            <div class='translate-service-edit-button'>
              <el-popconfirm
                width='220'
                icon-color='#53b21e'
                title='确认删除此记录吗?'
                confirm-button-text='确定'
                cancel-button-text='取消'
                @confirm='deleteTranslateHistory'
              >
                <template #reference>
                  <el-button :icon='Minus' size='small' />
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>

        <history-result-content :translate-record='translateRecordThis' />

      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { computed, ref } from 'vue'
import { updateTranslateRecordList } from '../../../../utils/translateRecordUtil'
import HistoryResultContent from './HistoryResultContent.vue'
import { Minus, Refresh } from '@element-plus/icons-vue'
import TranslateRecordVo from '../../../../../../common/class/TranslateRecordVo'
import { isMemberVip } from '../../../../utils/memberUtil'
import { findTranslateRecordDetail, findTranslateRecordPageList } from '../../../../api/translateRecord'
import { isNull } from '../../../../../../common/utils/validate'

// 翻译记录列表
const translateRecordList = ref([])
// 翻译记录数
const translateRecordSize = ref()
// 当前选择的翻译记录
const translateRecordThis = ref(new TranslateRecordVo())

const listLoading = ref(false)
const listNoMore = ref(false)
const listDisabled = computed(() => listLoading.value || listNoMore.value)

const pageInfo = ref({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
  totalPageCount: 0
})


// 初始加载数据
const init = (): void => {
  if (!isMemberVip()) {
    return
  }
  listLoading.value = true
  findTranslateRecordPageList({
    pageIndex: pageInfo.value.pageIndex,
    pageSize: pageInfo.value.pageSize
  }).then((data: any) => {
    listLoading.value = false
    translateRecordList.value = translateRecordList.value.concat(data['rows'])
    console.log('translateRecordList = ', translateRecordList.value)
    pageInfo.value.total = data['totalNumber']
    pageInfo.value.totalPageCount = data['totalPageCount']
    // 设置第一条数据为当前选中项
    selectOneTranslateRecordThis()
  })
}

// 初始加载数据
init()

// 设置窗口获取焦点事件
window.api.setWinFocusEvent(() => {
  const isNotRecord = pageInfo.value.total === 0
  if(pageInfo.value.pageIndex === 1) {
    translateRecordList.value = []
    init()
  }
  // 如果一开始获取到的记录是0条 数据加载完毕后大于0条的情况下需要触发选择第一条数据
  if (isNotRecord && pageInfo.value.total > 0) {
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
  if(isNull(translateRecord)) {
    return
  }
  findTranslateRecordDetail(translateRecord.id).then((translateServiceRecordList) => {
    translateRecordThis.value = {
      ...translateRecord,
      translateServiceRecordList: translateServiceRecordList.map(item => {
        return {
          translateServiceType: item.translateServiceType,
          translateServiceId: item.translateServiceId,
          translateStatus: true,
          translateVo: {
            translateList: [item.translateResultContent],
            usPhonetic: item.usPhonetic,
            ukPhonetic: item.ukPhonetic,
            usSpeech: item.usSpeech,
            ukSpeech: item.ukSpeech,
            explains: item.explains ? JSON.parse(item.explains) : [],
            wfs: item.wfs ? JSON.parse(item.wfs) : []
          }
        };
      })
    }
  })
}

/**
 * 设置第一条数据为当前选中项
 */
const selectOneTranslateRecordThis = (): void => {
  if(pageInfo.value.pageIndex != 1) {
    return
  }
  const translateRecord = translateRecordList.value[0]
  selectTranslateRecord(translateRecord)
}

/**
 * 刷新翻译记录
 */
const translateRecordListRefresh = (): void => {
  pageInfo.value.pageIndex = 1
  translateRecordList.value = []
  listNoMore.value = false
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
const load = () => {
  if (pageInfo.value.totalPageCount <= pageInfo.value.pageIndex) {
    listNoMore.value = true
    return
  }
  pageInfo.value.pageIndex = pageInfo.value.pageIndex + 1
  init()
  console.log('load')
}

</script>

<style lang='scss' scoped>
@import '../../../../css/set';

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
        overflow: auto;
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

  }
}

@import '../../../../css/translate.scss';


.translate-service-list-block::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.translate-service-list-block::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

.translate-service-list-block::-webkit-scrollbar-track {
  background-color: transparent;
}

</style>
