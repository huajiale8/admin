import createAxios from '/@/utils/axios'

const agentCustomUrl = '/admin/agent/custom/'

export function agentCustomList(params: any) {
    return createAxios({
        url: agentCustomUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
export function agentCustomLogList(params: any) {
    return createAxios({
        url: agentCustomUrl + 'log/changes',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
export function agentCustomLogConsumesList(params: any) {
    return createAxios({
        url: agentCustomUrl + 'log/consumes',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
export function agentCustomLogOperationsList(params: any) {
    return createAxios({
        url: agentCustomUrl + 'log/operations',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
export function agentCustomLogDiffList(params: any) {
    return createAxios({
        url: agentCustomUrl + 'log/diff',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

