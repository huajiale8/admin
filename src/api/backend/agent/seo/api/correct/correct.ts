import createAxios from '/@/utils/axios'

const errorCorrectUrl = '/admin/agent/seo/api/error/correct/'

export function agentSeoApiCorrectLists(params: any) {
    return createAxios({
        url: errorCorrectUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiCorrectDetail(params: any) {
    return createAxios({
        url: errorCorrectUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoApiCorrectCheck(params: any) {
    return createAxios({
        url: errorCorrectUrl + 'check',
        method: 'post',
        data: params,
    })
}
