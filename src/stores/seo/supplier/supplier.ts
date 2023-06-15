import {defineStore} from 'pinia'

export const agentSeoSupplierConfig = defineStore('agentSeoSupplierConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            refreshPage: false,
            operate: '新增资源素材',
            id: 0,
            type: 2,
            url: '',
            access_id: '',
            access_key: '',
        }
    },
    actions: {},
})
