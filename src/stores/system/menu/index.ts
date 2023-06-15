import {defineStore} from 'pinia'

export const menuConfig = defineStore('menuConfig', {
    state: () => {
        return {
            name: '',
            dialogVisible: false,
            refreshPage: false,
            operate: '新增权限组',
            id: 0,
            pid: 0,
            level: 0,
            isResourceShow: 0,
            treeList: [],
            selectedOptions: [],
            options: [],
            rules: [],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            flag: false,
            title: "",
            url: "",
            leaf: true,
            type: "menu_dir",
            sort: 50,
            is_show: 0,
            tips: "",
            component: "",
            icon: "",
            tableRef: {},
            status: 0,
            order: 0,
        }
    },
    actions: {},
})
