<template>
    <component :is="config.layout.layoutMode"></component>
</template>

<script setup lang="ts">
import {useConfig} from '/@/stores/config'
import {useNavTabs} from '/@/stores/navTabs'
import {useSiteConfig} from '/@/stores/siteConfig'
import {useAccessToken} from "/@/stores/accessToken";
import {useAdminInfo} from '/@/stores/adminInfo'
import {roleMenu} from "/@/api/backend/auth/group";
import {onMounted, onBeforeMount} from 'vue'
import {Session} from '/@/utils/storage'
import {userInfo} from '/@/api/backend'
import {websiteInfo} from "/@/api/common";
import {handleAdminRoute, getFirstRoute, routePush, getMenuPaths} from '/@/utils/router'
import router from '/@/router/index'
import {useEventListener} from '@vueuse/core'
import {BEFORE_RESIZE_LAYOUT} from '/@/stores/constant/cacheKey'
import {useRoute} from "vue-router";
import {adminBaseRoute} from "/@/router/static";
import {generalConfig} from "/@/api/backend/auth/common";
import {updateHtmlGreyClass} from "/@/utils/common";

const navTabs = useNavTabs()
const config = useConfig()
const siteConfig = useSiteConfig()
const adminInfo = useAdminInfo()
const accessToken = useAccessToken()
const route = useRoute()

onMounted(() => {
    if (!accessToken.access_token) return router.push({name: 'adminLogin'})

    init()
    onSetNavTabsMinWidth()
    useEventListener(window, 'resize', onSetNavTabsMinWidth)
    generalConfig({type: 'isGrey'}).then(res => {
        let status = res.data.content.status
        updateHtmlGreyClass(status)
    })
})
onBeforeMount(() => {
    onAdaptiveLayout()
    useEventListener(window, 'resize', onAdaptiveLayout)
})

const init = () => {
    websiteInfo().then((response) => {
        siteConfig.dataFill(response.data.content)
    })
    userInfo().then((response) => {
        adminInfo.dataFill(response.data.content)
    })
    roleMenu().then((response) => {
        handleAdminRoute(response.data.content)

        // 预跳转到上次路径
        if (route.query && route.query.url && route.query.url != adminBaseRoute.path) {
            // 检查路径是否有权限
            let menuPaths = getMenuPaths(navTabs.state.tabsViewRoutes)
            if (menuPaths.indexOf(route.query.url as string) !== -1) {
                let query = JSON.parse(route.query.query as string)
                routePush({path: route.query.url as string, query: Object.keys(query).length ? query : {}})
                return
            }
        }

        // 跳转到第一个菜单
        let firstRoute = getFirstRoute(navTabs.state.tabsViewRoutes)
        if (firstRoute) routePush(firstRoute.path)
    })
}

const onAdaptiveLayout = () => {
    let defaultBeforeResizeLayout = {
        layoutMode: config.layout.layoutMode,
        menuCollapse: config.layout.menuCollapse,
    }
    let beforeResizeLayout = Session.get(BEFORE_RESIZE_LAYOUT)
    if (!beforeResizeLayout) Session.set(BEFORE_RESIZE_LAYOUT, defaultBeforeResizeLayout)

    const clientWidth = document.body.clientWidth
    if (clientWidth < 1024) {
        config.setLayout('menuCollapse', true)
        config.setLayout('shrink', true)
        config.setLayoutMode('Classic')
    } else {
        let beforeResizeLayoutTemp = beforeResizeLayout || defaultBeforeResizeLayout

        config.setLayout('menuCollapse', beforeResizeLayoutTemp.menuCollapse)
        config.setLayout('shrink', false)
        config.setLayoutMode(beforeResizeLayoutTemp.layoutMode)
    }
}

// 在实例挂载后为navTabs设置一个min-width，防止宽度改变时闪现滚动条
const onSetNavTabsMinWidth = () => {
    const navTabs = document.querySelector('.nav-tabs') as HTMLElement
    if (!navTabs) {
        return
    }
    const navBar = document.querySelector('.nav-bar') as HTMLElement
    const navMenus = document.querySelector('.nav-menus') as HTMLElement
    const minWidth = navBar.offsetWidth - (navMenus.offsetWidth + 20)
    navTabs.style.width = minWidth.toString() + 'px'
}
</script>

<!-- 只有在 components 选项中的组件可以被动态组件使用-->
<script lang="ts">
import Default from '/@/layouts/backend/container/default.vue'
import Classic from '/@/layouts/backend/container/classic.vue'
import Streamline from '/@/layouts/backend/container/streamline.vue'

export default {
    components: {Default, Classic, Streamline},
}
</script>
