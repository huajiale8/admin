import {defineStore} from 'pinia'

export const bannerConfig = defineStore('bannerConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增UCG内容',
            id: '',
            banner_url: '',
            cover: '',
            refreshPage: false,
            place_id:'',
            place:[],
        }
    },
    actions: {},
})
