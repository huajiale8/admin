import type {App} from 'vue'
import {nextTick} from 'vue'
import * as elIcons from '@element-plus/icons-vue'
import router from '/@/router/index'
import Icon from '/@/components/icon/index.vue'
import {useNavTabs} from '/@/stores/navTabs'
import {useSiteConfig} from '../stores/siteConfig'
import {useTitle} from '@vueuse/core'
import {i18n} from '../assets/lang'
import {useRoute} from "vue-router";

export function registerIcons(app: App) {
    app.component('Icon', Icon)
    const icons = elIcons as any
    for (const i in icons) {
        app.component(`el-icon-${icons[i].name}`, icons[i])
    }
}

/* 加载网络css文件 */
export function loadCss(url: string): void {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.crossOrigin = 'anonymous'
    document.getElementsByTagName('head')[0].appendChild(link)
}

/* 加载网络js文件 */
export function loadJs(url: string): void {
    const link = document.createElement('script')
    link.src = url
    document.body.appendChild(link)
}
/**
 * 设置浏览器标题
 */
export function setTitleFromRoute() {
    if (typeof router.currentRoute.value.meta.title != 'string') {
        return
    }
    nextTick(() => {
        let webTitle = ''
        if ((router.currentRoute.value.meta.title as string).indexOf('pagesTitle.') === -1) {
            webTitle = router.currentRoute.value.meta.title as string
        } else {
            webTitle = i18n.global.t(router.currentRoute.value.meta.title as string)
        }
        const title = useTitle()
        const siteConfig = useSiteConfig()
        title.value = `${webTitle}${siteConfig.site_info.site_name ? ' - ' + siteConfig.site_info.site_name : ''}`
    })
}

/**
 * 是否是外部链接
 * @param path
 */
export function isExternal(path: string): boolean {
    return /^(https?|ftp|mailto|tel):/.test(path)
}

/**
 * 将数据构建为ElTree的data {label:'', children: []}
 * @param data
 */
export const buildJsonToElTreeData:any = (data: any) => {
    if (typeof data == 'object') {
        const childrens = []
        for (const key in data) {
            childrens.push({
                label: key + ': ' + data[key],
                children: buildJsonToElTreeData(data[key]),
            })
        }
        return childrens
    } else {
        return []
    }
}

/**
 * 是否在后台应用内
 */
export const isAdminApp = () => {
    if (/^\/admin/.test(router.currentRoute.value.fullPath) || window.location.hash.indexOf('#/admin') === 0) {
        return true
    }
    return false
}

/**
 * 页面按钮鉴权
 * @param name
 */
export const auth = (name: string) => {
    const route = useRoute()
    const authNode = useNavTabs().state.authNode
    const currentRoute = route.path
    const node = currentRoute + '/' + name
    for (const idx in authNode) {
        if (idx === currentRoute) {
            const nodeArray = authNode[idx]
            for (const key in nodeArray) {
                if (nodeArray[key] === node) {
                    return true;
                }
            }
        }
    }
    return false
}

export const getGreet = () => {
    const now = new Date()
    const hour = now.getHours()
    let greet = ''

    if (hour < 5) {
        greet = i18n.global.t('utils.Late at night, pay attention to your body!')
    } else if (hour < 9) {
        greet = i18n.global.t('utils.good morning!') + i18n.global.t('utils.welcome back')
    } else if (hour < 12) {
        greet = i18n.global.t('utils.Good morning!') + i18n.global.t('utils.welcome back')
    } else if (hour < 14) {
        greet = i18n.global.t('utils.Good noon!') + i18n.global.t('utils.welcome back')
    } else if (hour < 18) {
        greet = i18n.global.t('utils.good afternoon') + i18n.global.t('utils.welcome back')
    } else if (hour < 24) {
        greet = i18n.global.t('utils.Good evening') + i18n.global.t('utils.welcome back')
    } else {
        greet = i18n.global.t('utils.Hello!') + i18n.global.t('utils.welcome back')
    }
    return greet
}

/**
 * 给 HTML 添加 grey class
 * @param i
 */
export const updateHtmlGreyClass = (i: number) => {
    const htmlEl = document.getElementsByTagName('html')[0]
    if (i == 0) {
        htmlEl.setAttribute('class', 'grey')
    } else {
        htmlEl.setAttribute('class', '')
    }
}
