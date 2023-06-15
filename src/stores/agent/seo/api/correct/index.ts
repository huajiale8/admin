import {defineStore} from 'pinia'

export const agentSeoApiCorrectConfig = defineStore('agentSeoApiCorrectConfig', {
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
            current_ranking: '',
            quota: '',
            types: '',
            engine: '',
            price: '',
            supplier_type: 1,
            suppliers:[],
            consumeTypes:[],
            remark: ''
        }
    },
    actions: {},
})
