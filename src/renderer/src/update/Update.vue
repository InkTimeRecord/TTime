<template>
  <div class='block'>
    <div class='header'>
      <div class='function-tools-block'>
        <span
          v-if='
            autoUpdaterStatus === AutoUpdaterEnum.CHECKING_FOR_UPDATE ||
            autoUpdaterStatus === AutoUpdaterEnum.UPDATE_NOT_AVAILABLE
          '
          class='title'
        >
          当前版本 （{{ thisVersion }}）
        </span>
        <span v-else-if='autoUpdaterStatus === AutoUpdaterEnum.UPDATE_AVAILABLE' class='title'>
          发布新版本啦（{{ newVersion }}）
        </span>
        <span v-else class='title'> TTime更新 </span>
      </div>
    </div>

    <div class='content-layer'>
      <div class='content'>
        <div v-if='autoUpdaterStatus === AutoUpdaterEnum.UPDATE_AVAILABLE' class='content-block'>
          <span class='content-title'>更新内容：</span>
          <div class='content-message'>
            <div v-for='(content, index) in contentList' :key='index' class='content-message-block'>
              <span>{{ content }}</span>
              <br />
            </div>
          </div>
        </div>
        <el-result
          v-else-if='autoUpdaterStatus === AutoUpdaterEnum.UPDATE_NOT_AVAILABLE'
          icon='success'
          :title='thisVersion'
          sub-title='当前已是最新版本'
        >
        </el-result>
        <el-result
          v-else-if='autoUpdaterStatus === AutoUpdaterEnum.ERROR'
          icon='error'
          title='当前出现了一点问题'
          :sub-title='errorMsg'
        >
        </el-result>
      </div>
    </div>

    <div class='bottom'>
      <div class='bottom-block'>
        <el-button
          v-if='autoUpdaterStatus === AutoUpdaterEnum.UPDATE_AVAILABLE'
          type='success'
          @click='toOfficialPage'
        >跳转官网更新
        </el-button>
        <el-button
          v-if='autoUpdaterStatus === AutoUpdaterEnum.UPDATE_AVAILABLE && !forcedUpdate'
          @click='closeWin'
        >
          下次再说
        </el-button>
        <el-button v-if='forcedUpdate' @click='closeApp'> 退出</el-button>
        <el-button
          v-if='
            autoUpdaterStatus === AutoUpdaterEnum.CHECKING_FOR_UPDATE ||
            autoUpdaterStatus === AutoUpdaterEnum.ERROR
          '
          type='success'
          @click='updateStartCheck'
        >
          重试
        </el-button>
        <el-button
          v-if='
            autoUpdaterStatus === AutoUpdaterEnum.CHECKING_FOR_UPDATE ||
            autoUpdaterStatus === AutoUpdaterEnum.UPDATE_NOT_AVAILABLE ||
            autoUpdaterStatus === AutoUpdaterEnum.ERROR
          '
          @click='closeWin'
        >
          关闭
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { AutoUpdaterEnum } from '../enums/AutoUpdaterEnum'
import { ElLoading } from 'element-plus'
import { isNotNull } from '../utils/validate'
import { initTheme } from '../utils/themeUtil'

initTheme()

// 更新状态 默认检测中
const autoUpdaterStatus = ref(AutoUpdaterEnum.CHECKING_FOR_UPDATE)
// const autoUpdaterStatus = ref(AutoUpdaterEnum.UPDATE_NOT_AVAILABLE)
// const autoUpdaterStatus = ref(AutoUpdaterEnum.UPDATE_AVAILABLE)

// 强制更新状态
const forcedUpdate = ref(false)
// 当前版本
const thisVersion = ref('')
// 新版本
const newVersion = ref('')
// 新版本更新内容
const contentList = ref([])
// 错误信息
const errorMsg = ref('')

/**
 * 关闭窗口
 */
const closeWin = (): void => {
  window.api.closeUpdateWinEvent()
}

/**
 * 退出应用
 */
const closeApp = (): void => {
  window.api.closeAppEvent()
}

/**
 * 手动触发检测更新事件
 */
const updateStartCheck = (): void => {
  window.api.autoUpdaterStartCheck()
}

/**
 * 跳转官网
 */
const toOfficialPage = (): void => {
  window.api.jumpToPage('https://ttime.timerecord.cn')
  if (forcedUpdate) {
    setTimeout(() => {
      closeApp()
    }, 3000)
  } else {
    closeWin()
  }
}

let loading

/**
 * 安全的关闭加载Loading
 */
const securityCloseLoading = (loading): void => {
  if (isNotNull(loading)) {
    loading.close()
  }
}

/**
 * 监听自动更新事件
 */
window.api.autoUpdaterEvent((eventType, res) => {
  autoUpdaterStatus.value = eventType
  forcedUpdate.value = res.forcedUpdate
  thisVersion.value = res.thisVersion
  // 触发了方法就先关闭下载加载Loading
  securityCloseLoading(loading)
  if (AutoUpdaterEnum.CHECKING_FOR_UPDATE === eventType) {
    loading = ElLoading.service({
      // @ts-ignore 无缘无故检测说缺少属性 这里直接忽略
      target: document.querySelector('.content-layer'),
      lock: true,
      text: res.message
    })
  } else if (AutoUpdaterEnum.UPDATE_AVAILABLE === eventType) {
    // 存在新版本时触发
    thisVersion.value = res.thisVersion
    newVersion.value = res.newVersion
    let releaseNotes = res.releaseNotes
    if (isNotNull(releaseNotes)) {
      releaseNotes = releaseNotes.split('|')
    }
    // 添加之前先清空
    contentList.value = []
    releaseNotes.forEach((value) => {
      contentList.value.push(value)
    })
  } else if (AutoUpdaterEnum.UPDATE_NOT_AVAILABLE === eventType) {
    // 不存在新版本时触发
    thisVersion.value = res.thisVersion
  } else if (AutoUpdaterEnum.ERROR === eventType) {
    // 异常时触发
    errorMsg.value = res.message
  }
})
</script>

<style lang='scss' scoped>
@import '../css/global.scss';

.block {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: var(--ttime-translate-color-background);
  box-shadow: 1px 1px 4px -1px var(--ttime-box-shadow-color);
  border: solid 1px var(--ttime-translate-border-color);

  .header {
    // 配置窗口可拖拽
    -webkit-app-region: drag;
    height: 39px;
    margin-top: 5px;
    border-bottom: 1px solid var(--ttime-update-line-color);

    .function-tools-block {
      padding: 8px 15px 8px 10px;

      .title {
        font-size: 0.83em;
        font-weight: bold;
        color: var(--ttime-text-color);
      }
    }
  }

  .content {
    height: 271px;
    background-color: var(--ttime-translate-color-background);
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 8px;

    .content-block {
      padding: 10px 10px 10px 10px;
      font-size: 14px;
      color: var(--ttime-text-color);

      .content-title {
        font-size: 15px;
        font-weight: bold;
        padding: 20px;
        display: flex;
        justify-content: space-between;
      }

      .content-message {
        padding: 0 20px 0 20px;
        overflow-y: auto;
        height: 190px;
      }

      // 修改textarea滚动条样式
      .content-message::-webkit-scrollbar-track {
        background-color: transparent;
      }

      .content-message::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .content-message::-webkit-scrollbar-thumb {
        border-radius: 3px;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        background-color: #c3c3c3;
      }

      .content-message::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--ttime-update-line-color);

    .bottom-block {
      padding: 10px 10px 10px 10px;
      font-size: 14px;
      color: #342c2c;
    }
  }
}
</style>
