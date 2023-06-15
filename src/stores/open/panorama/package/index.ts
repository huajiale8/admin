import {defineStore} from 'pinia'

export const openPackageConfig = defineStore('openPackageStore', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            type: 1,
            custom_account_price: "",
            title: '',
            price: '',
            content: '',
            attaches: '',
            term: '',
            pid: '',
            parents: [],
            options: [],
            checkedAgents: [],
            agents: [],
            agent_ids: [],
            checked_agents: [],
            refreshPage: false,
            isIndeterminate: true,
            checkAll: false,
            is_show:false,
            dialog:false,
            can:true,
        }
    },
    actions: {},
})
