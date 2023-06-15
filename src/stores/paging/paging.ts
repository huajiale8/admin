import {defineStore} from 'pinia'

export const pagingConfig = defineStore('pagingConfig', {
    state: () => {
        return {
            paging: false,
            page: 1,
            pageSize: 5,
            name: '',
            pageInfo: {
                page: 1,
                pageSize: 5,
                name: ''
            }
            , total: 0
        }
    },
    actions: {},
})
