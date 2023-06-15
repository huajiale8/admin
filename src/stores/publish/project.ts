import {defineStore} from 'pinia'

export const projectConfig = defineStore('projectConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增项目',
            id: '',
            project_url: '',
            projectImg: '',
            refreshPage: false,
            order_type_id: '',
            project_type_id: '',
            wxShareContent: '',
            versions:'',
            dateValue: '', //上线时间
            order_typeList:[],//订单类型
            project_typeList:[],//项目类型
        }
    },
    actions: {},
})
