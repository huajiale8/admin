import {defineStore} from 'pinia'

export const cateConfig = defineStore('cateConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增分类配置',
            id: 0,
            level: 0,
            icon: '',
            cover: '',
            cover_mobile: '',
            refreshPage: false
        }
    },
    actions: {},
})
