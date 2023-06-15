import {defineStore} from 'pinia'

export const orderActivity = defineStore('orderActivity', {
    state: () => {
        return {
            dialogVisible: false,
            refreshPage: false,
            id: '',
            operate: '',
            price: '',
            name: ''
        }
    },
    actions: {},
})
