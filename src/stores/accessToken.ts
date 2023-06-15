import {defineStore} from 'pinia'
import {ACCESS_TOKEN} from '/@/stores/constant/cacheKey'
import {AccessToken} from '/@/stores/interface'

export const useAccessToken = defineStore('accessToken', {
    state: (): AccessToken => {
        return {
            access_token: '',
            token_type: '',
            expires_in: 0,
        }
    },
    actions: {
        dataFill(state: AccessToken) {
            this.$state = {...this.$state, ...state}
        },
        setToken(token: string, type: string) {
            this.access_token = type + ' ' + token
        },
        getToken() {
            return this.access_token
        },
        removeToken() {
            this.access_token = ''
        },
    },
    persist: {
        key: ACCESS_TOKEN,
    },
})
