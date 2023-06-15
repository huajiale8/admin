import {defineStore} from 'pinia'

export const itemsConfig = defineStore('itemsConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增服务项目',
            id: 0,
            level: 0,
            categories: [],
            price: '',
            unit: '',
            cid: '',
            searchName: '',
            refreshPage: false
        }
    },
    actions: {},
})
