import {defineStore} from 'pinia'

export const accountConfig = defineStore('accountConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            dialog: false,
            operate: '新增服务项目',
            password: '',
            accountName: '',
            id: 0,
            level: 0,
            phone: '',
            categories: [],
            price: '',
            unit: '',
            cid: '',
            searchName: '',
            newList: {},
            oldList: [],
            refreshPage: false,
            pageInfos: {
                page: 1,
                pageSize: 10,
                name: ''
            },
            flag: false,
            listPageName: '',
            logsFlag: false,
            logsList:[],
        }
    },
    actions: {},
})
