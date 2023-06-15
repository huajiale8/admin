import createAxios from '/@/utils/axios'

const systemEngineUrl = '/admin/agent/system/engine/'

export function agentSystemEngineList() {
    return createAxios({
        url: systemEngineUrl + 'lists',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function agentSystemEngineUpdate(params: any) {
    return createAxios({
        url: systemEngineUrl + 'update',
        method: 'post',
        data: params
    })
}
