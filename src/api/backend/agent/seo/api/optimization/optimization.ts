import createAxios from '/@/utils/axios'

const apiOptimizationUrl = '/admin/agent/seo/api/optimization/'

export function agentSeoApiOptimizationList(params: any) {
    return createAxios({
        url: apiOptimizationUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiOptimizationLists(params: any) {
    return createAxios({
        url: apiOptimizationUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
    })
}
