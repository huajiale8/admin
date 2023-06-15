import {defineStore} from 'pinia'

export const generalConfig = defineStore('generalConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增通用配置',
            id: 0,
            level: 0,
            refreshPage: false,
        }
    },
    actions: {},
})
