import {defineStore} from 'pinia'

export const kaleidoscopeCaseConfig = defineStore('kaleidoscopeCaseConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增分类配置',
            id: '',
            type: 1,
            level: 0,
            labels: [],
            techs: [],
            types: [],
            label_ids: '',
            tech_ids: '',
            video: '',
            type_ids: '',
            url: '',
            icon: '',
            content: '',
            recommend: 0,
            detailType: 0,
            cover: '',
            cover_mobile: '',
            typeFlag: false,
            refreshPage: false,
            detailVisible: false,
            options: [
                {label: '链接', value: 1},
                {label: '图片', value: 2},
                {label: '视频', value: 3}
            ],
        }
    },
    actions: {},
})
