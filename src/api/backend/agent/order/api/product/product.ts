import createAxios from '/@/utils/axios'

const apiPanoramaUrl = '/admin/agent/order/api/panorama/'

export function agentOrderApiPanoramaCustomList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentPanoramaApiDetailList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentPanoramaApiAuditList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'audit',
        method: 'post',
        data: params,

    })
}

export function agentPanoramaApiRejectList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'reject',
        method: 'post',
        data: params,
    })
}

export function agentApiPanoramaChargebackList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'chargeback',
        method: 'post',
        data: params,
    })
}

export function agentApiPanoramaChangeList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'change',
        method: 'post',
        data: params,
    })
}

export function agentApiPanoramaDeadlineList(params: any) {
    return createAxios({
        url: apiPanoramaUrl + 'deadline',
        method: 'post',
        data: params,
    })
}
