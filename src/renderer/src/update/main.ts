import { createApp } from 'vue'
import Update from './Update.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../css/css-light-vars.css'
import '../css/css-dark-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import SvgIcon from '../components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

const app = createApp(Update)

// 注册 element-plus 所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('svg-icon', SvgIcon)
app.use(ElementPlus).mount('#app')
