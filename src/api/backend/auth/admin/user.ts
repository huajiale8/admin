import createAxios from '/@/utils/axios'

const userUrl = '/admin/admin/user/'
const groupUrl = '/admin/admin/group/'

export function userLists(params: any) {
    return createAxios({
        url: userUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function userUpdate(params: any) {
    return createAxios({
        url: userUrl + 'update',
        method: 'post',
        data: params
    })
}

export function userDetail(params: any) {
    return createAxios({
        url: userUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}


export function userFlag(params: any, item: any) {
    return createAxios({
        url: userUrl + item,
        method: 'post',
        data: params
    })
}

export function userGroup(params: any) {
    return createAxios({
        url: groupUrl + 'index',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function GroupUpdate(params: any) {
    return createAxios({
        url: groupUrl + 'update',
        method: 'post',
        data: params
    })
}







