import {defineStore} from 'pinia'

export const memberConfig = defineStore('memberConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            refreshPage: false,
            operate: '新增会员',
            phone: '',
            password: '',
            level: 0,
            mid: '',
            nickname: '',
            email: '',
            openid: '',
            qq: '',
        }
    },
    actions: {},
})
