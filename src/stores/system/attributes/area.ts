import {defineStore} from 'pinia'

export const areaConfig = defineStore('areaConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            refreshPage: false,
            operate: '新增权限组',
            id: 0,
            pid: 0,
            level: 0,
            treeList: [],
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
