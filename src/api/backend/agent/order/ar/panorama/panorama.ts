import createAxios from '/@/utils/axios'

const arProductUrl = '/admin/agent/order/ar/product/'
export function agentOrderArProductCustomList(params: any) {
    return createAxios({
        url: arProductUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentOrderArProductCustomDetail(params: any) {
    return createAxios({
        url: arProductUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentOrderArProductCustomQuote(data: any) {
    return createAxios({
        url: arProductUrl + 'quote',
        method: 'post',
        data,

    })
}

export function agentOrderArProductCustomFinish(params: any) {
    return createAxios({
        url: arProductUrl + 'finish',
        method: 'post',
        data: params,
    })
}
export function agentOrderArProductCustomClose(params: any) {
    return createAxios({
        url: arProductUrl + 'close',
        method: 'post',
        data: params,
    })
}
