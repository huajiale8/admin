import createAxios from '/@/utils/axios'

const orderTypeUrl = 'admin/publish/order/type/'

export function orderTypeLists(params: any) {
    return createAxios({
        url: orderTypeUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function orderTypeUpdate(params: any) {
    return createAxios({
        url: orderTypeUrl + 'update',
        method: 'post',
        data: params
    })
}

export function orderTypeDelete(params: any) {
    return createAxios({
        url: orderTypeUrl + 'delete',
        method: 'post',
        data: params
    })
}




