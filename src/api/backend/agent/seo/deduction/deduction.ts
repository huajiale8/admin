import createAxios from '/@/utils/axios'

const seoDeductionUrl = '/admin/agent/seo/deduction/'

export function agentSeoDeductionList(params: any) {
    return createAxios({
        url: seoDeductionUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoDeductionLists(params: any) {
    return createAxios({
        url: seoDeductionUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
    })
}

export function agentSeoDeductionQuery(params: any) {
    return createAxios({
        url: '/admin/agent/account/query',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoDeductionCustomQuery(params: any) {
    return createAxios({
        url: '/admin/agent/custom/query',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
