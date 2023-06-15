import {defineStore} from 'pinia'

export const logConfig = defineStore('logConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增权限组',
            id: 0,
            level: 0,
            logList: [],
            rules: [],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            flag: false
        }
    },
    actions: {},
})
