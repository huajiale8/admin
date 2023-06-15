import createAxios from '/@/utils/axios'

const seoOptimizatioUrl = '/admin/agent/seo/optimization/'
const keywordTaskUrl = '/admin/agent/seo/keyword/task'

export function agentSeoOptimizationList(params: any) {
    return createAxios({
        url: seoOptimizatioUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoOptimizationLists(params: any) {
    return createAxios({
        url: seoOptimizatioUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
    })
}


export function agentSeoKeywordTask(params: any) {
    return createAxios({
        url: keywordTaskUrl,
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoKeyquery(params: any) {
    return createAxios({
        url: '/admin/agent/account/query',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

