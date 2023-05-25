<template>
  <svg :class='svgClass' aria-hidden='true'>
    {{ 'mode = ' + mode }}
    <use :xlink:href='iconName' :fill='color' />
  </svg>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { initTheme } from '../../utils/themeUtil'

const props = defineProps({
  iconClass: {
    type: String,
    required: true
  },
  className: { // 给图标添加class
    type: String,
    default: ''
  },
  color: { // 设置图标颜色
    type: String,
    default: '#333'
  }
})

const mode = initTheme()
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})
</script>

<style scoped lang='scss'>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
