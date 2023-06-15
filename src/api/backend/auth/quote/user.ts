import createAxios from '/@/utils/axios'

const authUrl = '/admin/auth/'
const profileURl = '/admin/profile/'

export function userLists() {
    return createAxios({
        url: authUrl + 'userInfo',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function userSave(params: any) {
    return createAxios({
        url: profileURl + 'save',
        method: 'post',
        data: params
    })
}





