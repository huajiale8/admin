import {defineStore} from 'pinia'

export const agentOrderApiDashboardConfig = defineStore('agentOrderApiDashboardConfig', {
    state: () => {
        return {
            name: '', //客户名称
            contact_name: '', //联系人
            contact_information: '', //联系方式
            salesman: '', //业务员
            package: '', //全景套餐
            years: '', //套餐年限
            price: '', //总价格
            remarks: '', //其他需求
            flow_status: 0, //订单流程状态
            url: '', //最终交付URL地址
            date: '', //拍摄日期
            editFlag: false, //审核按钮
            chargebackFlag: false, //退单按钮
            changeFlag: false, //变更订单流程状态
            deadlineFlag: false, //截止日期
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            address: '', //详细地址
            dateValueTow: null, //截止日期数据
            refreshPage: false,
            remark: '',
            options:[],
            selectedOptions:[], //请选择所在区域
        }
    },
    actions: {},
})
