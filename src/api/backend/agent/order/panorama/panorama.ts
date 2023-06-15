import createAxios from '/@/utils/axios'

const orderPanoramaUrl = '/admin/agent/order/panorama/'

export function agentOrderPanoramaCustomList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentPanoramaDetailList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentPanoramaAuditList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'audit',
        method: 'post',
        data: params,

    })
}

export function agentPanoramaRejectList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'reject',
        method: 'post',
        data: params,
    })
}

export function agentPanoramaChargebackList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'chargeback',
        method: 'post',
        data: params,
    })
}

export function agentPanoramaChangeList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'change',
        method: 'post',
        data: params,
    })
}

export function agentPanoramaDeadlineList(params: any) {
    return createAxios({
        url: orderPanoramaUrl + 'deadline',
        method: 'post',
        data: params,
    })
}
