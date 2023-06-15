import {defineStore} from 'pinia'

export const roleConfig = defineStore('roleConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            operate: '新增权限组',
            id: 0,
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
