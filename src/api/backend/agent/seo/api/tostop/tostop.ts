import createAxios from '/@/utils/axios'

const apiTostopUrl = '/admin/agent/seo/api/tostop/'

export function agentSeoApiTostopList(params: any) {
    return createAxios({
        url: apiTostopUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiTostopDetail(params: any) {
    return createAxios({
        url: apiTostopUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiTostopCheck(params: any) {
    return createAxios({
        url: apiTostopUrl + 'check',
        method: 'post',
        data: params,
    })
}
