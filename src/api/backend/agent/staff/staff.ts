import createAxios from '/@/utils/axios'

const agentStaffUrl= '/admin/agent/staff/'

export function agentStaffList(params: any) {
    return createAxios({
        url: agentStaffUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentStaffStatus(params: any, type: string) {
    return createAxios({
        url: agentStaffUrl + type,
        method: 'post',
        data: params,
    })
}

export function agentStaffLogsLists(params: any) {
    return createAxios({
        url: agentStaffUrl + 'logs/lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentStaffLogsDiff(params: any) {
    return createAxios({
        url: agentStaffUrl + 'logs/diff',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
