import createAxios from '/@/utils/axios'

const authRealUrl = '/admin/auth/real/'

export function realLists(params: any) {
    return createAxios({
        url: authRealUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function realDetail(params: any) {
    return createAxios({
        url: authRealUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function realReject(params: any) {
    return createAxios({
        url: authRealUrl + 'reject',
        method: 'post',
        data: params
    })
}

export function realPass(params: any) {
    return createAxios({
        url: authRealUrl + 'pass',
        method: 'post',
        data: params
    })
}
