import createAxios from '/@/utils/axios'

const seoOverrateUrl = '/admin/agent/seo/overrate/'

export function agentSeoOverrateList(params: any) {
    return createAxios({
        url: seoOverrateUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoCustomsList(params: any) {
    return createAxios({
        url: seoOverrateUrl + 'customs',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
