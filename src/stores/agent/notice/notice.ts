import {defineStore} from 'pinia'

export const agentNoticeConfig = defineStore('agentNoticeConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增资源素材',
            id: 0,
            title: '',
            content: '',
            attaches: '',
            files: [],
            backups: [],
            refreshPage: false,
        }
    },
    actions: {},
})
