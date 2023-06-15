import {defineStore} from 'pinia'

export const openPlatformConfig = defineStore('openPackageStore', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            price: '',
            content: '',
            refreshPage: false,
        }
    },
    actions: {},
})
