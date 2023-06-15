import {defineStore} from 'pinia'

export const caseConfig = defineStore('caseConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增UCG内容',
            id: '',
            level: 0,
            panorama_url: '',
            thumb_pc: '',
            thumb_mobile: '',
            refreshPage: false,
            selectedOptions:[],
            category_id:'',
            place_id:'',
            location_id:'',
            category:[],
            place:[],
            options: [],
        }
    },
    actions: {},
})
