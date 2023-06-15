import {defineStore} from 'pinia'

export const agentAccountConfig = defineStore('agentAccountConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            email: '',
            level: 0,
            address: '', //详细地址
            director: '', //负责人
            option_type: '', //请选择代理商层级
            refreshPage: false,
            phone: '',
            certType_id: '',
            place_id: '',
            location_id: '',
            remark: '',
            options:[],
            cascader:[],
            selectedOptions:[], //请选择所在区域
            superior_aid:0, //请选择代理商层级
            pay_type:0, //请选择代理商层级
            authorityAreaDialog:false,
            reason:'代理充值',
            amount:'',
            addCapitalDialog:false,
            treeList:[],
            checked_keys:[],
            newList:{},
            oldList:{},
            dialog:false
        }
    },
    actions: {},
})
