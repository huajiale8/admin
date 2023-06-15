import createAxios from '/@/utils/axios'

const apiKeywordUrl = '/admin/agent/seo/api/keyword/'

export function agentSeoApiKeywordList(params: any) {
    return createAxios({
        url: apiKeywordUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiKeywordDetail(params: any) {
    return createAxios({
        url: apiKeywordUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiKeywordCheck(params: any) {
    return createAxios({
        url: apiKeywordUrl + 'check',
        method: 'post',
        data: params,

    })
}
