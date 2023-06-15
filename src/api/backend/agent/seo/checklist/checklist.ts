import createAxios from '/@/utils/axios'

const agentSeoKeywordUrl = '/admin/agent/seo/keyword/'
const agentSeoSupplierUrl = '/admin/agent/seo/supplier/'
const agentSeoSupplierQueryUrl = '/admin/agent/seo/supplier/query'
export function agentSeoKeywordList(params: any) {
    return createAxios({
        url: agentSeoKeywordUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSupplierList(params: any) {
    return createAxios({
        url: agentSeoSupplierQueryUrl,
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoKeywordDetail(params: any) {
    return createAxios({
        url: agentSeoKeywordUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoKeywordCheck(params: any) {
    return createAxios({
        url: agentSeoKeywordUrl + 'check',
        method: 'post',
        data: params,

    })
}
