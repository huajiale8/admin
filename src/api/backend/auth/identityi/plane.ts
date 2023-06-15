import createAxios from '/@/utils/axios'

const authPlaneUrl = '/admin/auth/plane/'

export function planeLists(params: any) {
    return createAxios({
        url: authPlaneUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function planeDetail(params: any) {
    return createAxios({
        url: authPlaneUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function planeReject(params: any) {
    return createAxios({
        url: authPlaneUrl + 'reject',
        method: 'post',
        data: params
    })
}

export function planePass(params: any) {
    return createAxios({
        url: authPlaneUrl + 'pass',
        method: 'post',
        data: params
    })
}
