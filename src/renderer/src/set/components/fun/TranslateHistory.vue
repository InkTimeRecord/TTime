<template>
  <div>
    <translate-history-vip-list v-if='isMemberVip()' />
    <translate-history-list v-else />
  </div>
</template>
<script setup lang='ts'>
import TranslateHistoryVipList from './history/TranslateHistoryVipList.vue'
import TranslateHistoryList from './history/TranslateHistoryList.vue'
import { isMemberVip } from '../../../utils/memberUtil'
</script>

<style lang='scss' scoped>

</style>
