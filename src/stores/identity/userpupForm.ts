import {defineStore} from 'pinia'

export const userConfig = defineStore('userConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增管理员',
            id: 0,
            level: 0,
            phone: '',
            password: '',
            dialog: false,
            accesses: [],
            type: [],
            refreshPage: false,
        }
    },
    actions: {},
})
