import createAxios from '/@/utils/axios'

const hotelOrderUrl = '/admin/activity/hotel/order/'

export function orderLists(params: any) {
    return createAxios({
        url: hotelOrderUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function orderOperation(params: any, _method: string) {
    return createAxios({
        url: hotelOrderUrl + _method,
        method: 'post',
        params,
        data: {noSuccessMessage: true}
    })
}
