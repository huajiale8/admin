import createAxios from '/@/utils/axios'

const agentAccountUrl = '/admin/agent/account/'

export function accountManagementLists(params: any) {
    return createAxios({
        url: agentAccountUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function accountManagementDetail(params: any) {
    return createAxios({
        url: agentAccountUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function accountManagementUpdate(params: any) {
    return createAxios({
        url: agentAccountUrl + 'update',
        method: 'post',
        data: params,
    })
}

export function accountManagement(params: any, type: string) {
    return createAxios({
        url: agentAccountUrl + type,
        method: 'post',
        data: params,
    })
}

export function accountManagementArea(params: any) {
    return createAxios({
        url: agentAccountUrl + 'area',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function accountManagementAreaPost(params: any) {
    return createAxios({
        url: agentAccountUrl + 'area',
        method: 'post',
        data: params,
    })
}

export function accountManagementCapital(params: any) {
    return createAxios({
        url: agentAccountUrl + 'capital',
        method: 'post',
        data: params,
    })
}

export function accountManagementLogs(params: any) {
    return createAxios({
        url: agentAccountUrl + 'logs/lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function accountManagementLogsDiff(params: any) {
    return createAxios({
        url: agentAccountUrl + 'logs/diff',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function accountManagementCapitalLists(params: any) {
    return createAxios({
        url: agentAccountUrl + 'capital/lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function accountManagementRollback(params: any) {
    return createAxios({
        url: agentAccountUrl + 'capital/consume/rollback',
        method: 'post',
        data: params,
    })
}
