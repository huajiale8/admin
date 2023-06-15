import {defineStore} from 'pinia'

export const agentOrderArProductConfig = defineStore('agentOrderArProductConfig', {
    state: () => {
        return {
            custom_name:'',//客户名称
            contract_info:'',//客户联系方式
            status:0,//订单状态
            price:0,//订单报价
            name: '', //客户名称
            url: '', //最终交付URL地址
            date: '', //拍摄日期
            priceFlag: false, //审核按钮
            modelFlag: false, //退单按钮
            changeFlag: false, //变更订单流程状态
            deadlineFlag: false, //截止日期
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            address: '', //详细地址
            dateValueTow: null, //截止日期数据
            refreshPage: false,
            remark: '',
            skus:[], //商品信息
            selectedOptions:[], //请选择所在区域
        }
    },
    actions: {},
})
