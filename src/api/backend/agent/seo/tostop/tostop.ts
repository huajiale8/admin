import createAxios from '/@/utils/axios'

const seoTostopUrl = '/admin/agent/seo/tostop/'

export function agentSeoTostopList(params: any) {
    return createAxios({
        url: seoTostopUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoTostopDetail(params: any) {
    return createAxios({
        url: seoTostopUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoTostopCheck(params: any) {
    return createAxios({
        url: seoTostopUrl + 'check',
        method: 'post',
        data: params,

    })
}
