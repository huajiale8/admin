import {defineStore} from 'pinia'

export const kaleidoscopeTypeConfig = defineStore('kaleidoscopeTypeConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增分类配置',
            id: '',
            level: 0,
            sort: '',
            refreshPage: false
        }
    },
    actions: {},
})
