import {defineStore} from 'pinia'
import {ADMIN_INFO} from '/@/stores/constant/cacheKey'
import {AdminInfo} from '/@/stores/interface'

export const useAdminInfo = defineStore('adminInfo', {
    state: (): AdminInfo => {
        return {
            id: 0,
            name: '',
            avatar: '',
            phone: '',
            status: 0,
        }
    },
    actions: {
        dataFill(state: AdminInfo) {
            this.$state = {...this.$state, ...state}
        },
    },
    persist: {
        key: ADMIN_INFO,
    },
})
