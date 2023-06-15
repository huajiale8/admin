import createAxios from '/@/utils/axios'

const panoramaUrl = 'admin/portal/source/panorama/'

export function panoramaLists(params: any) {
    return createAxios({
        url: panoramaUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: panoramaUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: panoramaUrl + 'disable',
        method: 'post',
        data: params
    })
}


