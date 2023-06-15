import {defineStore} from 'pinia'

export const agentSeoStopConfig = defineStore('stop_main', {
    state: () => {
        return {
            dialogVisible: false,
            refreshPage: false,
            company_name: '',
            id: '',
            contact_name: '',
            supplier_id: '',
            keyword: '',
            website: '',
            engine: '',
            price: '',
            supplier_type: 1,
            suppliers:[],
            remark: ''
        }
    },
    actions: {},
})
