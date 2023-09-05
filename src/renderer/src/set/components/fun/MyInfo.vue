<template>
  <div class='my-layer'>
    <div class='my-layer-up'>
      <span class='my-name none-select'>
        凉城
         <el-tag type='light  ' class='mx-1' effect='dark'>普通会员</el-tag>
      </span>
    </div>
    <div>
      <div>
        <span>普通会员</span>
      </div>
      <div>
        <span>专业会员</span>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>

/**
 * 跳转页面
 */
const toPage = (url): void => {
  window.api.jumpToPage(url)
}
</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

.my-layer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;

  .my-layer-up {
    display: flex;
    flex-direction: column;
    align-items: center;

    .about-logo {
      -webkit-user-drag: none;
      height: 100px;
      width: 100px;
    }

    .my-name {
      color: var(--el-text-color-regular);
      margin-top: 15px;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 1px;
    }

  }

}
</style>
