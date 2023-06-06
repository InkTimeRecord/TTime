<template>
  <div class="block">
    <Header />
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
</script>

<style lang="scss" scoped>
@import '../css/global.scss';

.block {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: var(--ttime-color-background);
  box-shadow: 1px 1px 4px -1px var(--ttime-box-shadow-color);
  border: solid 1px var(--ttime-translate-border-color);
}
</style>
