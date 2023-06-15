import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {loadLang} from '/@/assets/lang'
import {registerIcons} from '/@/utils/common'
import ElementPlus from 'element-plus'
import mitt from 'mitt'
import pinia from '/@/stores/index'
import CodeDiff from 'v-code-diff'
import {directives} from '/@/utils/directives'
import 'element-plus/dist/index.css'
import '/@/assets/styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

async function start() {
    const app = createApp(App)
    // 注册所有图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
    app.use(router)
    app.use(pinia)
    // 全局语言包加载
    const i18n = await loadLang(app)
    app.use(ElementPlus)
    app.use(CodeDiff)
    // 全局注册
    directives(app) // 指令
    registerIcons(app) // icons
    app.mount('#app')
    app.config.globalProperties.eventBus = mitt()
}

start()
