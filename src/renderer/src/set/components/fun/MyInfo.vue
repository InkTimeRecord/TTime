<template>
  <div class="my-layer">
    <div class="my-block">
      <template v-if="loginStatus === LoginStatusEnum.N">
        <a class="my-info" @click="toLogin">
          <span class="my-name none-select"> 未登录 </span>
          <div class="my-sub-block">
            <span class="none-select">开通会员享受更多权益</span>
            <span class="none-select">登录 ></span>
          </div>
        </a>
      </template>
      <template v-else-if="loginStatus === LoginStatusEnum.ING">
        <a class="my-info" @click="againLogin">
          <span class="my-name none-select"> 登录中... </span>
          <div class="my-sub-block">
            <span class="none-select">开通会员享受更多权益</span>
            <span class="none-select">重新登录 ></span>
          </div>
        </a>
      </template>
      <div v-else-if="loginStatus === LoginStatusEnum.Y" class="my-info">
        <span class="my-name none-select">
          hi，152***1234
          <!--         <el-tag type='light' class='mx-1' effect='dark'>普通会员</el-tag>-->
        </span>
        <div class="my-sub-block">
          <span class="none-select">开通会员享受更多权益</span>
          <span class="none-select">退出登录 ></span>
        </div>
      </div>
    </div>
    <div class="member-introduction-block">
      <div class="member-introduction-group">
        <div>
          <el-tag class="member-title-ordinary" type="info" effect="dark" size="large"
            >免费版
          </el-tag>
          <span class="my-sub-block none-select">免费享受基础功能</span>
          <div class="member-introduction-list">
            <template v-for="(info, key) in memberOrdinaryList" :key="key">
              <div class="member-introduction-icon-layer">
                <div class="member-introduction-icon-block">
                  <svg-icon :icon-class="info.icon" class="member-introduction-icon" />
                </div>
                <span class="member-introduction-icon-name">{{ info.name }}</span>
              </div>
            </template>
          </div>
        </div>
        <div>
          <el-tag class="member-title-vip" type="success" effect="dark" size="large">会员版</el-tag>
          <span class="my-sub-block none-select">会员版享受设备同步等更多权益</span>

          <div class="member-introduction-list">
            <template v-for="(info, key) in memberVipList" :key="key">
              <div class="member-introduction-icon-layer">
                <div class="member-introduction-icon-block">
                  <svg-icon :icon-class="info.icon" class="member-introduction-icon" />
                </div>
                <span class="member-introduction-icon-name">{{ info.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { cacheGet, cacheSet } from '../../../utils/cacheUtil'
import { LoginStatusEnum } from '../../../../../common/enums/LoginStatusEnum'

const memberOrdinaryList = ref([
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' }
])

const memberVipList = ref([
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' },
  { icon: 'thumbtack', name: '设备同步' }
])

/**
 * 更新登录状态
 */
const updateLoginStatus = (): void => {
  loginStatus.value = cacheGet('loginStatus')
}

const loginStatus = ref()

// 更新登录状态
updateLoginStatus()

// 窗口显示事件 当窗口显示时触发
window.api.winShowEvent(() => {
  // 更新登录状态
  updateLoginStatus()
})

const againLogin = (): void => {
  cacheSet('loginStatus', LoginStatusEnum.N)
  // 更新登录状态
  updateLoginStatus()
  toLogin()
}

const toLogin = (): void => {
  window.api.jumpToPage(
    'https://ink.timerecord.cn/userEntryTTime/login?redirect=http://127.0.0.1:11223/login'
  )
}
</script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.my-layer {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 500px;
  min-height: 500px;

  .my-block {
    width: 100%;
    height: 120px;
    background: var(--ttime-translate-service-color-background);
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    .my-info {
      padding: 30px 0 0 21px;
      cursor: pointer;
    }

    .my-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--el-text-color-regular);
    }

    .my-sub-block {
      display: flex;
      justify-content: space-between;
      padding: 16px 21px 0 0;
      font-weight: 400;
      font-size: 12px;
      color: var(--ttime-tips-text-color);
    }
  }

  .member-introduction-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 361px;
    background: var(--ttime-translate-service-color-background);
    border-radius: 8px;
    margin-top: 20px;

    .member-introduction-group {
      margin: 24px 26px;

      .member-title-ordinary {
        width: 78px;
        height: 28px;
        top: 202px;
        left: 250px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 700;
        background: var(--ttime-member-introduction-title-color);
        border-color: var(--ttime-member-introduction-title-color);
        color: var(--el-text-color-regular);
      }

      .member-title-vip {
        width: 78px;
        height: 28px;
        top: 202px;
        left: 250px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 700;
      }

      .my-sub-block {
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        font-weight: 400;
        font-size: 12px;
        color: var(--ttime-tips-text-color);
      }

      .member-introduction-list {
        display: flex;
        justify-content: space-between;
        height: 98px;
        margin-top: 16px;

        .member-introduction-icon-layer {
          display: flex;
          align-items: center;
          flex-direction: column;

          .member-introduction-icon-block {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 18px;
            background: #212224;

            .member-introduction-icon {
              width: 16px;
              height: 16px;
            }
          }

          .member-introduction-icon-name {
            margin-top: 10px;
            font-size: 12px;
            color: var(--ttime-tips-text-color);
          }
        }
      }
    }
  }
}
</style>
