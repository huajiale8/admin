import {defineStore} from 'pinia'

export const orderConfig = defineStore('orderConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            dialog: false,
            operate: '报价单详情',
            orderName: '新增报价单',
            password: '',
            id: 0,
            level: 0,
            searchName: '',
            toCheck: false,
            refreshPage: false,
            categories: [], //服务
            services: [] as any, //服务深拷贝
            activity: [], //优惠
            code: '',
            pdfList: {},
            dialogToReject: false,
            rejectReason: {
                id: 0,
                reason: ''
            },
            newOrderDialogVisible: false,
            discountInfo: {
                remark: '', //备注数据
                type: [],
                discount: 0,
                serviceDiscount: [],

            },
            RebateDate: [],//折扣数据
            activityArr: [],
            beforeTaxCost: 0,
            afterTaxCost: '',
            active: 0,
            partAInfo: {
                custom_name: '', //甲方名称
                custom_contact: '',//甲方联系人
                custom_phone: '',//甲方联系方式
            },
            partBInfo: {
                id: '', //乙方经理ID
                bidder_name: '',//乙方客户经理名称
                bidder_phone: '', //乙方联系方式
            },
            dateInfo: {
                dateRange: [], //项目工期
                dateStart: '',//开始时间
                dateEnd: '',//结束时间
                dayRange: 0, //项目工期总天数
            },
            flag: false
        }

    },
    actions: {},
})
