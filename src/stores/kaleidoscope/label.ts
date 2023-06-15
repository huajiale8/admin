import {defineStore} from 'pinia'

export const kaleidoscopeLabelConfig = defineStore('kaleidoscopeLabelConfig', {
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
