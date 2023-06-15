import _ from 'lodash'
import {reactive} from 'vue'
import {i18n} from '../assets/lang'
import {defineStore} from 'pinia'
import {STORE_TAB_VIEW_CONFIG} from '/@/stores/constant/cacheKey'
import {NavTabs} from '/@/stores/interface/index'
import {RouteLocationNormalized, RouteRecordRaw} from 'vue-router'

export const useNavTabs = defineStore(
    'navTabs',
    () => {
        const state: NavTabs = reactive({
            // 激活tab的index
            activeIndex: 0,
            // 激活的tab
            activeRoute: null,
            // tab列表
            tabsView: [],
            // 当前tab是否全屏
            tabFullScreen: false,
            // 从后台加载到的菜单路由列表
            tabsViewRoutes: [],
            // 按钮权限节点
            authNode: {},
        })

        function addTab(route: RouteLocationNormalized) {
            if (!route.meta.addTab) return
            for (const key in state.tabsView) {
                if (state.tabsView[key].path === route.path) {
                    state.tabsView[key].params = !_.isEmpty(route.params) ? route.params : state.tabsView[key].params
                    state.tabsView[key].query = !_.isEmpty(route.query) ? route.query : state.tabsView[key].query
                    return
                }
            }
            state.tabsView.push(route)
        }

        function closeTab(route: RouteLocationNormalized) {
            state.tabsView.map((v, k) => {
                if (v.path == route.path) {
                    state.tabsView.splice(k, 1)
                    return
                }
            })
        }

        /**
         * 关闭多个标签
         * @param retainMenu 需要保留的标签，否则关闭全部标签
         */
        const closeTabs = (retainMenu: RouteLocationNormalized | false = false) => {
            if (retainMenu) {
                state.tabsView = [retainMenu]
            } else {
                state.tabsView = []
            }
        }

        const setActiveRoute = (route: RouteLocationNormalized): void => {
            const currentRouteIndex: number = state.tabsView.findIndex((item: RouteLocationNormalized) => {
                return item.path === route.path
            })
            if (currentRouteIndex === -1) return
            state.activeRoute = route
            state.activeIndex = currentRouteIndex
        }

        const setTabsViewRoutes = (data: RouteRecordRaw[]): void => {
            state.tabsViewRoutes = data
        }

        const setAuthNode = (key: string, data: string[]) => {
            state.authNode[key] = data
        }

        const setFullScreen = (fullScreen: boolean): void => {
            state.tabFullScreen = fullScreen
        }

        return {state, addTab, closeTab, closeTabs, setActiveRoute, setTabsViewRoutes, setAuthNode, setFullScreen}
    },
    {
        persist: {
            key: STORE_TAB_VIEW_CONFIG,
        },
    }
)
