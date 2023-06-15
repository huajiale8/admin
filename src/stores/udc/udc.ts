import {defineStore} from 'pinia'

export const udcConfig = defineStore('udcConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            udcImg: '',
            source_name: '',
            source: '',
            type: '',
            operate: '',
            id: 0,
            refreshPage: false,
            fileList: [],
            optionsList: [
                {
                    label: '合作伙伴',
                    value: 1,
                },
                {
                    label: '新看点集团',
                    value: 2,
                },
                {
                    label: '818平台',
                    value: 3,
                },
            ]
        }
    },
    actions: {},
})
