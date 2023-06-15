import {defineStore} from 'pinia'

export const agentSeoChecklistConfig = defineStore('checklist_main', {
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
            supplier_type: '',
            suppliers:[],
            remark: ''
        }
    },
    actions: {},
})
