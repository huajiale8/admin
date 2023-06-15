import {defineStore} from 'pinia'

export const agentSeoApiStopConfig = defineStore('agentSeoApiStopConfig', {
    state: () => {
        return {
            dialogVisible: false,
            refreshPage: false,
            custom_name: '',
            id: '',
            contact_name: '',
            custom_contact_name: '',
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
