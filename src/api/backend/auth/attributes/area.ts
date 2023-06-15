import createAxios from '/@/utils/axios'

const attributesUrl = '/admin/system/attributes/'

export function areaLists(pid ?: number) {
    return createAxios({
        url: attributesUrl + 'area/lists',
        method: 'get',
        params: {
            pid: pid,
        },
        data: {noSuccessMessage: true}
    })
}

export function areaDetail(id: number) {
    return createAxios({
        url: attributesUrl + 'area/detail',
        method: 'get',
        params: {
            id: id,
        },
        data: {noSuccessMessage: true}
    })
}

export function UpdateArea(params: any) {
    return createAxios({
        url: attributesUrl + 'area/update',
        method: 'post',
        data: params
    })
}

export function areaDisableApi(params: any) {
    return createAxios({
        url: attributesUrl + 'area/disable',
        method: 'post',
        data: params,
    })
}

export function areaEnableApi(params: any) {
    return createAxios({
        url: attributesUrl + 'area/enable',
        method: 'post',
        data: params,
    })
}

