import {defineStore} from 'pinia'

export const certConfig = defineStore('certConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增资源素材',
            id: '',
            level: 0,
            panorama_url: '',
            thumb_pc: '',
            thumb_mobile: '',
            refreshPage: false,
            category_id: '',
            certType_id: '',
            place_id: '',
            location_id: '',
            category: [],
            dateValue: '',
            fileList:[],
            previewImg:[],
            certType: [
                {id: 1, name: '一星级'},
                {id: 2, name: '二星级'},
                {id: 3, name: '三星级'},
            ],
        }
    },
    actions: {},
})
