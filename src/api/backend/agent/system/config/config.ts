import createAxios from '/@/utils/axios'

const systemConfigUrl = '/admin/agent/system/config/'

export function agentSystemList() {
    return createAxios({
        url: systemConfigUrl + 'lists',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function agentSystemUpdateList(data: any) {
    return createAxios({
        url: systemConfigUrl + 'update',
        method: 'post',
        data
    })
}
