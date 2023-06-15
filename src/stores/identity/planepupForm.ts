import {defineStore} from 'pinia'

export const planeConfig = defineStore('planeConfig', {
    state: () => {
        return {
            dialogVisible: false,
            operate: '',
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
