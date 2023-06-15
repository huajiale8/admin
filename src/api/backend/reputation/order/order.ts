import createAxios from '/@/utils/axios'

const reputationOrderUrl = 'admin/reputation/order/'
export function reputationOrderLists(params: any) {
    return createAxios({
        url: reputationOrderUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
// 更新店铺
export function reputationOrderUpdate(params: any) {
    return createAxios({
        url: reputationOrderUrl + 'update',
        method: 'post',
        data: params
    })
}
// 上线店铺
export function reputationOrderOnline(params: any) {
    return createAxios({
        url: reputationOrderUrl + 'online',
        method: 'post',
        data: params
    })
}
// 下线店铺
export function reputationOrderOffline(params: any) {
    return createAxios({
        url: reputationOrderUrl + 'offline',
        method: 'post',
        data: params
    })
}

