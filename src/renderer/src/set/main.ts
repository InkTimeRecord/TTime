import { createApp } from 'vue'
import Set from './Set.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../css/css-light-vars.css'
import '../css/css-dark-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import SvgIcon from '../components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(Set)

// 注册 element-plus 所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('svg-icon', SvgIcon)
app.use(ElementPlus, {
  locale: zhCn,
}).mount('#app')
