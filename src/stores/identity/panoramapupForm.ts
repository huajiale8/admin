import {defineStore} from 'pinia'

export const panoramaConfig = defineStore('panoramaConfig', {
    state: () => {
        return {
            dialogVisible: false,
            operate: '银行卡绑定信息审核',
            rules: [],
            bankList: {},
            id: '',
            status: 0,
            refreshPage: false,
            flag: false
        }
    },
    actions: {},
})
