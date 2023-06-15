import createAxios from '/@/utils/axios'

const udcUrl = '/admin/udc/'
export function udcLists(params: any) {
    return createAxios({
        url: udcUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function udcDetail(params: any) {
    return createAxios({
        url: udcUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function udcUpdate(params: any) {
    return createAxios({
        url: udcUrl + 'update',
        method: 'post',
        data: params,
    })
}

export function udcManagementEnable(params: any) {
    return createAxios({
        url: udcUrl + 'enable',
        method: 'post',
        data: params,
    })
}
export function udcManagementDisable(params: any) {
    return createAxios({
        url: udcUrl + 'disable',
        method: 'post',
        data: params,
    })
}
