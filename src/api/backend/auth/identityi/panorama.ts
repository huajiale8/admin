import createAxios from '/@/utils/axios'

const authPanoramaUrl = '/admin/auth/panorama/'

export function panoramaLists(params: any) {
    return createAxios({
        url: authPanoramaUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function panoramaDetail(params: any) {
    return createAxios({
        url: authPanoramaUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function panoramaReject(params: any) {
    return createAxios({
        url: authPanoramaUrl + 'reject',
        method: 'post',
        data: params
    })
}

export function panoramaPass(params: any) {
    return createAxios({
        url: authPanoramaUrl + 'pass',
        method: 'post',
        data: params
    })
}
